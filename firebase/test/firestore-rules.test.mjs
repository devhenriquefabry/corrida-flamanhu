// Testes das regras do Firestore contra o emulador oficial.
// Rodar da raiz do projeto: npm run test:regras
import { readFileSync } from 'node:fs';
import { after, before, beforeEach, describe, test } from 'node:test';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, getDocs, collection, setDoc, updateDoc, writeBatch, deleteDoc } from 'firebase/firestore';

const ADMIN = 'admin@flamanhu.com';
let env;

const anon = () => env.unauthenticatedContext().firestore();
const user = (email) => env.authenticatedContext(email.replace(/\W/g, ''), { email }).firestore();

// Grava dados de cenário ignorando as regras
const seed = (fn) => env.withSecurityRulesDisabled((ctx) => fn(ctx.firestore()));

const seedAdmin = () => seed(async (db) => {
  await setDoc(doc(db, 'nightrun_admins', ADMIN), { email: ADMIN, role: 'admin' });
  await setDoc(doc(db, 'nightrun_settings', 'admin_bootstrap_done'), { by: ADMIN });
});

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-flamanhu',
    firestore: { rules: readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8') },
  });
});
after(() => env.cleanup());
beforeEach(() => env.clearFirestore());

describe('primeiro administrador (bootstrap)', () => {
  test('banco vazio: usuário logado cria a si mesmo como admin junto com a trava', async () => {
    const db = user('dono@flamanhu.com');
    const batch = writeBatch(db);
    batch.set(doc(db, 'nightrun_admins', 'dono@flamanhu.com'), { email: 'dono@flamanhu.com' });
    batch.set(doc(db, 'nightrun_settings', 'admin_bootstrap_done'), { by: 'dono@flamanhu.com' });
    await assertSucceeds(batch.commit());
  });

  test('sem a trava no mesmo lote, não cria admin', async () => {
    const db = user('dono@flamanhu.com');
    await assertFails(setDoc(doc(db, 'nightrun_admins', 'dono@flamanhu.com'), { email: 'dono@flamanhu.com' }));
  });

  test('não cria admin para outro e-mail', async () => {
    const db = user('dono@flamanhu.com');
    const batch = writeBatch(db);
    batch.set(doc(db, 'nightrun_admins', 'outro@x.com'), { email: 'outro@x.com' });
    batch.set(doc(db, 'nightrun_settings', 'admin_bootstrap_done'), { by: 'x' });
    await assertFails(batch.commit());
  });

  test('depois de inicializado, ninguém mais se autopromove', async () => {
    await seedAdmin();
    const db = user('invasor@x.com');
    const batch = writeBatch(db);
    batch.set(doc(db, 'nightrun_admins', 'invasor@x.com'), { email: 'invasor@x.com' });
    batch.set(doc(db, 'nightrun_settings', 'admin_bootstrap_done'), { by: 'invasor' });
    await assertFails(batch.commit());
  });

  test('visitante sem login não cria admin nem com o banco vazio', async () => {
    await assertFails(setDoc(doc(anon(), 'nightrun_admins', 'x@x.com'), { email: 'x@x.com' }));
  });
});

describe('administradores', () => {
  beforeEach(seedAdmin);

  test('visitante não lista nem lê admins', async () => {
    await assertFails(getDocs(collection(anon(), 'nightrun_admins')));
    await assertFails(getDoc(doc(anon(), 'nightrun_admins', ADMIN)));
  });

  test('usuário comum lê só o próprio cadastro (para o login saber que não é admin)', async () => {
    const db = user('atleta@x.com');
    await assertSucceeds(getDoc(doc(db, 'nightrun_admins', 'atleta@x.com')));
    await assertFails(getDoc(doc(db, 'nightrun_admins', ADMIN)));
  });

  test('admin lista e adiciona admins', async () => {
    const db = user(ADMIN);
    await assertSucceeds(getDocs(collection(db, 'nightrun_admins')));
    await assertSucceeds(setDoc(doc(db, 'nightrun_admins', 'novo@x.com'), { email: 'novo@x.com' }));
  });
});

describe('configurações', () => {
  beforeEach(seedAdmin);

  test('nightrun_settings: público lê, só admin grava', async () => {
    await assertSucceeds(getDoc(doc(anon(), 'nightrun_settings', 'site_maintenance')));
    await assertFails(setDoc(doc(anon(), 'nightrun_settings', 'site_maintenance'), { registrationsClosed: false }));
    await assertFails(setDoc(doc(user('x@x.com'), 'nightrun_settings', 'lotes'), { mode: 'manual' }));
    await assertSucceeds(setDoc(doc(user(ADMIN), 'nightrun_settings', 'lotes'), { mode: 'manual' }));
  });

  test('a trava de bootstrap não pode ser apagada nem refeita por não-admin', async () => {
    await assertFails(deleteDoc(doc(user('x@x.com'), 'nightrun_settings', 'admin_bootstrap_done')));
    await assertFails(setDoc(doc(user('x@x.com'), 'nightrun_settings', 'admin_bootstrap_done'), { by: 'x' }));
  });

  test('system_settings (chaves do WhatsApp etc.): só admin', async () => {
    await assertFails(getDoc(doc(anon(), 'system_settings', 'nightrun_whatsapp')));
    await assertFails(getDoc(doc(user('x@x.com'), 'system_settings', 'nightrun_whatsapp')));
    await assertSucceeds(getDoc(doc(user(ADMIN), 'system_settings', 'nightrun_whatsapp')));
  });
});

describe('inscrições', () => {
  beforeEach(async () => {
    await seedAdmin();
    await seed((db) => setDoc(doc(db, 'nightrun_registrations', 'r1'), { nome: 'A', paymentStatus: 'pendente' }));
  });

  test('público cria inscrição pendente', async () => {
    await assertSucceeds(setDoc(doc(anon(), 'nightrun_registrations', 'nova'), { nome: 'B', paymentStatus: 'pendente' }));
  });

  test('público cria inscrição gratuita já paga', async () => {
    await assertSucceeds(setDoc(doc(anon(), 'nightrun_registrations', 'free'), { nome: 'C', paymentStatus: 'pago', gratuito: true }));
  });

  test('público NÃO cria inscrição paga sem ser gratuita', async () => {
    await assertFails(setDoc(doc(anon(), 'nightrun_registrations', 'golpe'), { nome: 'D', paymentStatus: 'pago' }));
  });

  test('público NÃO marca inscrição como paga nem apaga', async () => {
    await assertFails(updateDoc(doc(anon(), 'nightrun_registrations', 'r1'), { paymentStatus: 'pago' }));
    await assertFails(deleteDoc(doc(anon(), 'nightrun_registrations', 'r1')));
  });

  test('público lê uma inscrição pelo ID (link de pagamento)', async () => {
    await assertSucceeds(getDoc(doc(anon(), 'nightrun_registrations', 'r1')));
  });

  test('ninguém além do admin lista inscrições (CPF, endereço, saúde)', async () => {
    await assertFails(getDocs(collection(anon(), 'nightrun_registrations')));
    await assertFails(getDocs(collection(user('x@x.com'), 'nightrun_registrations')));
    await assertSucceeds(getDocs(collection(user(ADMIN), 'nightrun_registrations')));
  });

  test('admin altera inscrição', async () => {
    await assertSucceeds(updateDoc(doc(user(ADMIN), 'nightrun_registrations', 'r1'), { paymentStatus: 'pago' }));
  });
});

describe('cupons', () => {
  beforeEach(async () => {
    await seedAdmin();
    await seed((db) => setDoc(doc(db, 'nightrun_discount_coupons', 'FLA10'), { active: true, usedCount: 0, maxUses: 5, value: 10 }));
  });

  test('público consome exatamente 1 uso', async () => {
    await assertSucceeds(updateDoc(doc(anon(), 'nightrun_discount_coupons', 'FLA10'), { usedCount: 1 }));
  });

  test('público não zera o contador nem muda o desconto', async () => {
    await assertFails(updateDoc(doc(anon(), 'nightrun_discount_coupons', 'FLA10'), { usedCount: 0, maxUses: 999 }));
    await assertFails(updateDoc(doc(anon(), 'nightrun_discount_coupons', 'FLA10'), { usedCount: 1, value: 100 }));
  });

  test('público não lista cupons', async () => {
    await assertFails(getDocs(collection(anon(), 'nightrun_discount_coupons')));
  });
});

describe('sorteios', () => {
  beforeEach(async () => {
    await seedAdmin();
    await seed(async (db) => {
      await setDoc(doc(db, 'nightrun_sorteios', 's1'), { titulo: 'Sorteio', premio: 'Tênis', status: 'agendado' });
      await setDoc(doc(db, 'nightrun_sorteios_ganhadores', 'g1'), { registrationId: 'r1', telefone: '33999990000' });
    });
  });

  test('coordenador muda o status, mas não o prêmio nem o resultado', async () => {
    await assertSucceeds(updateDoc(doc(anon(), 'nightrun_sorteios', 's1'), { status: 'acontecendo' }));
    await assertFails(updateDoc(doc(anon(), 'nightrun_sorteios', 's1'), { premio: 'Carro' }));
    // o resultado é gravado pelo worker
    await assertFails(updateDoc(doc(anon(), 'nightrun_sorteios', 's1'), { ganhadorIds: ['r9'], totalElegiveis: 1 }));
  });

  test('ganhador grava só a imagem de vitória', async () => {
    await assertSucceeds(updateDoc(doc(anon(), 'nightrun_sorteios_ganhadores', 'g1'), { vitoriaImageUrl: 'https://x/img.png' }));
    await assertFails(updateDoc(doc(anon(), 'nightrun_sorteios_ganhadores', 'g1'), { telefone: '000' }));
  });

  test('configuração de sorteio é só do admin', async () => {
    await assertFails(getDocs(collection(anon(), 'nightrun_sorteios_config')));
  });
});

describe('padrão', () => {
  test('coleções não listadas são negadas', async () => {
    await assertFails(setDoc(doc(anon(), 'nightrun_messages', 'x'), { a: 1 }));
    await assertFails(getDocs(collection(anon(), 'qualquer_coisa')));
  });
});
