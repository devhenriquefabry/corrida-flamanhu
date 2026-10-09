import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { collection, doc, getDocs, query, serverTimestamp, where, writeBatch } from 'firebase/firestore';
import { ArrowRight, CheckCircle2, MessageCircle, Repeat, Search, ShieldAlert, User, X } from 'lucide-react';
import { db } from '../../firebase';
import { useDialog } from '../../context/CustomDialogContext';
import { buildNewOwnerTransferMessage, buildOldOwnerTransferMessage, buildWhatsAppUrl } from '../../utils/titularidadeUtils';

type Registration = {
  id: string;
  nome?: string;
  cpf?: string;
  telefone?: string;
  categoria?: string;
  kit?: string;
  tamanhoCamiseta?: string;
  paymentStatus?: string;
  [key: string]: any;
};

type Props = {
  origin: Registration;
  onClose: () => void;
  onTransferred: () => void;
};

const buildOldOwnerMessage = (origin: Registration, dest: Registration) => buildOldOwnerTransferMessage(origin.nome || '', dest.nome || '');
const buildNewOwnerMessage = (origin: Registration, dest: Registration) => buildNewOwnerTransferMessage(dest.nome || '', origin.nome || '');

export default function TransferTitularidadeModal({ origin, onClose, onTransferred }: Props) {
  const { showAlert, showConfirm } = useDialog();
  const [loadingPending, setLoadingPending] = useState(true);
  const [pendentes, setPendentes] = useState<Registration[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Registration | null>(null);
  const [transferring, setTransferring] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoadingPending(true);
      try {
        const snap = await getDocs(query(collection(db, 'nightrun_registrations'), where('paymentStatus', '==', 'pendente')));
        setPendentes(snap.docs.map(item => ({ id: item.id, ...item.data() } as Registration)).filter(item => item.id !== origin.id));
      } catch (error) {
        console.error('[TransferTitularidade] load pendentes', error);
        showAlert('Erro ao carregar inscrições pendentes.', 'error');
      } finally {
        setLoadingPending(false);
      }
    };
    load();
  }, [origin.id]);

  const results = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return pendentes.slice(0, 30);
    return pendentes.filter(item => [item.nome, item.cpf, item.telefone, item.email]
      .some(value => String(value || '').toLowerCase().includes(term))).slice(0, 30);
  }, [pendentes, search]);

  const executeTransfer = async () => {
    if (!selected) return;
    setTransferring(true);
    try {
      const batch = writeBatch(db);
      const originRef = doc(db, 'nightrun_registrations', origin.id);
      const destRef = doc(db, 'nightrun_registrations', selected.id);

      batch.update(originRef, {
        paymentStatus: 'cancelado',
        motivoCancelamento: 'transferencia_titularidade',
        titularidadeTransferida: true,
        titularidadeTransferidaParaId: selected.id,
        titularidadeTransferidaParaNome: selected.nome || '',
        titularidadeTransferidaParaTelefone: selected.telefone || '',
        titularidadeTransferidaEm: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      batch.update(destRef, {
        paymentStatus: 'pago',
        titularidadeRecebida: true,
        titularidadeRecebidaDeId: origin.id,
        titularidadeRecebidaDeNome: origin.nome || '',
        titularidadeRecebidaDeTelefone: origin.telefone || '',
        titularidadeRecebidaEm: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await batch.commit();
      setDone(true);
      onTransferred();
    } catch (error) {
      console.error('[TransferTitularidade] transfer failed', error);
      showAlert('Erro ao transferir a titularidade. Nada foi alterado.', 'error');
    } finally {
      setTransferring(false);
    }
  };

  const confirmTransfer = () => {
    if (!selected) return;
    showConfirm(
      `Transferir a titularidade de "${origin.nome}" (confirmada) para "${selected.nome}" (pendente)? ` +
      `A inscrição atual será cancelada e a nova passará a confirmada.`,
      executeTransfer,
    );
  };

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(28, 25, 23,.68)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 2000 }}>
      <div style={{ background: '#fff', width: '100%', maxWidth: 620, maxHeight: '88vh', display: 'flex', flexDirection: 'column', borderRadius: 24, boxShadow: '0 24px 60px rgba(28, 25, 23,.28)', overflow: 'hidden' }}>
        <div style={{ padding: '22px 26px', borderBottom: '1px solid #e7e5e4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Repeat size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, color: '#141112', fontSize: '1.1rem', fontWeight: 950 }}>Transferir titularidade</h2>
              <span style={{ color: '#78716c', fontSize: '.78rem', fontWeight: 700 }}>De: {origin.nome}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: '#f5f5f4', width: 36, height: 36, borderRadius: 10, color: '#78716c', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        <div style={{ padding: '20px 26px', overflowY: 'auto', flex: 1 }}>
          {!done ? (
            <>
              <div style={{ display: 'flex', gap: 10, padding: 14, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 14, marginBottom: 18 }}>
                <ShieldAlert size={18} color="#b45309" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ margin: 0, color: '#92400e', fontSize: '.8rem', fontWeight: 700, lineHeight: 1.5 }}>
                  Ao confirmar, a inscrição de <strong>{origin.nome}</strong> será marcada como cancelada (transferência) e a
                  inscrição pendente escolhida abaixo passará a <strong>confirmada</strong>, registrada como recebedora da titularidade.
                </p>
              </div>

              <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 900, color: '#78716c', marginBottom: 8, textTransform: 'uppercase' }}>
                Buscar inscrição pendente (nome, CPF ou telefone)
              </label>
              <div style={{ position: 'relative', marginBottom: 16 }}>
                <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#a8a29e' }} />
                <input
                  value={search}
                  onChange={event => { setSearch(event.target.value); setSelected(null); }}
                  placeholder="Digite para buscar..."
                  style={{ width: '100%', height: 46, padding: '0 14px 0 44px', borderRadius: 12, border: '1px solid #e7e5e4', fontWeight: 700, color: '#141112', outline: 'none' }}
                />
              </div>

              <div style={{ border: '1px solid #e7e5e4', borderRadius: 16, overflow: 'hidden', maxHeight: 260, overflowY: 'auto' }}>
                {loadingPending ? (
                  <div style={{ padding: 24, textAlign: 'center', color: '#78716c', fontWeight: 700 }}>Carregando pendentes...</div>
                ) : results.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', color: '#78716c', fontWeight: 700 }}>Nenhuma inscrição pendente encontrada.</div>
                ) : results.map(item => {
                  const isSelected = selected?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelected(item)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                        background: isSelected ? '#eff6ff' : '#fff', border: 'none', borderBottom: '1px solid #f5f5f4',
                        cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: isSelected ? '#2563eb' : '#f5f5f4', color: isSelected ? '#fff' : '#a8a29e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <User size={17} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <strong style={{ display: 'block', color: '#141112', fontSize: '.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.nome || 'Sem nome'}</strong>
                        <small style={{ color: '#78716c', fontWeight: 700 }}>{item.cpf || 'CPF não informado'}{item.telefone ? ` · ${item.telefone}` : ''}</small>
                      </div>
                      {isSelected && <CheckCircle2 size={20} color="#2563eb" />}
                    </button>
                  );
                })}
              </div>

              {selected && (
                <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 16, background: '#fafaf9', borderRadius: 16, border: '1px solid #e7e5e4' }}>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ display: 'block', fontSize: '.65rem', fontWeight: 900, color: '#dc2626', textTransform: 'uppercase' }}>Perde a vaga</span>
                    <strong style={{ color: '#141112', fontSize: '.88rem' }}>{origin.nome}</strong>
                  </div>
                  <ArrowRight size={22} color="#a8a29e" />
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ display: 'block', fontSize: '.65rem', fontWeight: 900, color: '#16a34a', textTransform: 'uppercase' }}>Fica confirmado</span>
                    <strong style={{ color: '#141112', fontSize: '.88rem' }}>{selected.nome}</strong>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ margin: '0 0 6px', color: '#141112', fontSize: '1.05rem', fontWeight: 950 }}>Titularidade transferida!</h3>
              <p style={{ margin: '0 0 24px', color: '#78716c', fontSize: '.85rem', fontWeight: 700 }}>
                Agora avise as duas pessoas pelo WhatsApp.
              </p>

              <div style={{ display: 'grid', gap: 12, textAlign: 'left' }}>
                <button
                  type="button"
                  onClick={() => window.open(buildWhatsAppUrl(origin.telefone || '', buildOldOwnerMessage(origin, selected!)), '_blank', 'noopener,noreferrer')}
                  disabled={!origin.telefone}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 14, border: '1px solid #fecaca', background: '#fef2f2', cursor: origin.telefone ? 'pointer' : 'not-allowed', opacity: origin.telefone ? 1 : .6 }}
                >
                  <MessageCircle size={20} color="#dc2626" />
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: 'block', color: '#991b1b', fontSize: '.86rem' }}>Avisar antigo titular</strong>
                    <small style={{ color: '#b91c1c', fontWeight: 700 }}>{origin.nome} {origin.telefone ? `· ${origin.telefone}` : '· sem telefone'}</small>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => window.open(buildWhatsAppUrl(selected!.telefone || '', buildNewOwnerMessage(origin, selected!)), '_blank', 'noopener,noreferrer')}
                  disabled={!selected?.telefone}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 14, border: '1px solid #bbf7d0', background: '#f0fdf4', cursor: selected?.telefone ? 'pointer' : 'not-allowed', opacity: selected?.telefone ? 1 : .6 }}
                >
                  <MessageCircle size={20} color="#16a34a" />
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: 'block', color: '#166534', fontSize: '.86rem' }}>Avisar novo titular</strong>
                    <small style={{ color: '#15803d', fontWeight: 700 }}>{selected?.nome} {selected?.telefone ? `· ${selected.telefone}` : '· sem telefone'}</small>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '18px 26px', borderTop: '1px solid #e7e5e4', display: 'flex', gap: 12 }}>
          {!done ? (
            <>
              <button onClick={onClose} style={{ flex: 1, border: '1px solid #e7e5e4', background: '#fff', borderRadius: 12, padding: 13, color: '#78716c', fontWeight: 900, cursor: 'pointer' }}>
                Cancelar
              </button>
              <button
                onClick={confirmTransfer}
                disabled={!selected || transferring}
                style={{ flex: 1.4, border: 'none', background: '#141112', color: '#fff', borderRadius: 12, padding: 13, fontWeight: 900, cursor: selected ? 'pointer' : 'not-allowed', opacity: selected ? 1 : .6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <Repeat size={18} /> {transferring ? 'Transferindo...' : 'Transferir titularidade'}
              </button>
            </>
          ) : (
            <button onClick={onClose} style={{ width: '100%', border: 'none', background: '#141112', color: '#fff', borderRadius: 12, padding: 14, fontWeight: 900, cursor: 'pointer' }}>
              Fechar
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
