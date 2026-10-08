import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useDialog } from '../context/CustomDialogContext';
import { useLoading } from '../components/LoadingService';
import { 
  User, Lock, Eye, EyeOff, ArrowRight, 
  ChevronLeft, LayoutPanelLeft 
} from 'lucide-react';
import '../App.css';
import { withBase } from '../utils/withBase';
import { workerApi, WorkerApiError } from '../utils/workerApi';

export default function UnifiedLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useDialog();
  const { showLoading } = useLoading();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return showAlert('Preencha e-mail e senha.', 'warning');
    
    setLoading(true);
    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.replace(/\D/g, '');

    try {
      // 0. SISTEMA SEM NENHUM ADMIN: oferece criar o primeiro. A trava
      // admin_bootstrap_done é pública; a lista de admins não (firestore.rules).
      const bootstrapSnap = await getDoc(doc(db, 'nightrun_settings', 'admin_bootstrap_done'));
      if (!bootstrapSnap.exists()) {
        setLoading(false);
        showConfirm(
          'SISTEMA NÃO INICIALIZADO: Deseja criar o primeiro administrador com este e-mail e senha',
          async () => {
            try {
              setLoading(true);
              await createUserWithEmailAndPassword(auth, cleanEmail, password).catch(async (err) => {
                if (err.code !== 'auth/email-already-in-use') throw err;
                await signInWithEmailAndPassword(auth, cleanEmail, password);
              });
              // admin + trava na mesma gravação: as regras só aceitam os dois juntos
              const batch = writeBatch(db);
              batch.set(doc(db, 'nightrun_admins', cleanEmail), {
                email: cleanEmail,
                role: 'admin',
                createdAt: new Date().toISOString()
              });
              batch.set(doc(db, 'nightrun_settings', 'admin_bootstrap_done'), {
                by: cleanEmail,
                at: new Date().toISOString()
              });
              await batch.commit();
              localStorage.setItem('nightrun_admin_auth', 'true');
              showAlert('Sistema inicializado com sucesso!', 'success');
              navigate('/admin/dashboard');
            } catch (err: any) {
              showAlert('Erro ao inicializar: ' + err.message, 'error');
            } finally {
              setLoading(false);
            }
          }
        );
        return;
      }

      // 1. TENTAR LOGIN COMO ADMIN: autentica primeiro, depois confere o cadastro.
      // Admins novos recebem a conta e um e-mail para definir a senha pela tela
      // Administradores — não existe mais "primeiro acesso cria a senha".
      const adminUser = await signInWithEmailAndPassword(auth, cleanEmail, password).catch(() => null);
      if (adminUser) {
        const adminDoc = await getDoc(doc(db, 'nightrun_admins', cleanEmail));
        if (adminDoc.exists()) {
          localStorage.setItem('nightrun_admin_auth', 'true');
          showLoading(1500, 'Acessando Painel Admin...');
          setTimeout(() => navigate('/admin/dashboard'), 1500);
          return;
        }
        await signOut(auth);
      }

      // 2. TENTAR LOGIN COMO ATLETA
      // O mesmo e-mail pode ter várias inscrições (ex: um responsável cadastrando vários atletas),
      // cada uma com seu próprio CPF/senha. O Firebase Auth só guarda 1 senha por e-mail, então
      // NÃO autenticamos por ali (tentar geraria erro 400 sempre que o CPF digitado não for o
      // mesmo que criou a conta daquele e-mail). A validação real é o CPF batendo com a inscrição,
      // conferida no worker (o navegador não pode listar inscrições) - o ID dela é salvo
      // localmente e é o que identifica o atleta no dashboard.
      if (cleanPassword.length === 11) {
        try {
          const { registrationId } = await workerApi<{ registrationId: string }>('/public/atleta/login', {
            email: cleanEmail,
            cpf: cleanPassword,
          });
          try { await signOut(auth); } catch {} // Limpa qualquer sessão (admin/outro atleta) que possa estar ativa
          localStorage.setItem('nightrun_atleta_auth', 'true');
          localStorage.setItem('nightrun_atleta_reg_id', registrationId);
          showLoading(1000, 'Acessando Área do Atleta...');
          // Navegação completa (não só o router) para o contexto de autenticação recarregar
          // já lendo a inscrição selecionada acima.
          setTimeout(() => { window.location.href = withBase('/atleta/dashboard'); }, 1000);
          return;
        } catch (err) {
          if (!(err instanceof WorkerApiError) || err.status !== 401) throw err;
        }
      }
      showAlert('E-mail ou senha incorretos.', 'error');
    } catch (err: any) {
      showAlert('Erro ao autenticar: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="athlete-login-page">
      <div className="athlete-login-container">
        <header className="athlete-login-header">
          <img src={withBase("/sistema/LOGO horizontal NIGHT RUN SEM FUNDO (em amarelo e branco).png")} alt="MCU Night Run" className="athlete-login-logo" />
          <p>Acesse sua conta para gerenciar sua inscrição ou administrar o evento.</p>
          <div className="header-accent-line" />
        </header>

        <div className="athlete-section-title">
          <div className="icon-box">
            <LayoutPanelLeft size={22} />
          </div>
          <h2>ÁREA DE <span className="highlight">ACESSO</span></h2>
        </div>

        <form onSubmit={handleLogin}>
          <div className="athlete-form-group">
            <label>E-MAIL</label>
            <div className="athlete-input-wrapper">
              <User className="icon" size={20} />
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="seu@email.com" 
                autoComplete="email"
              />
            </div>
          </div>

          <div className="athlete-form-group">
            <label>SENHA</label>
            <div className="athlete-input-wrapper">
              <Lock className="icon" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="........" 
              />
              <button 
                type="button" 
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="athlete-form-options">
            <a href="#" className="athlete-forgot" onClick={(e) => { e.preventDefault(); showAlert('Use seu CPF (apenas números) como senha.', 'info'); }}>
              Esqueci minha senha
            </a>
          </div>

          <button type="submit" className="athlete-btn-primary" disabled={loading}>
            {loading ? 'VERIFICANDO...' : 'ACESSAR CONTA'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="partners-banner transparent">
          <img src={withBase("/sistema/logo-mcu.png")} alt="MCU" className="partner-logo" />
          <div className="partner-divider" />
          <img src={withBase("/sistema/logo-ademare.png")} alt="Ademare" className="partner-logo" />
        </div>

        <Link to="/" className="athlete-back-link">
          <ChevronLeft size={18} />
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
