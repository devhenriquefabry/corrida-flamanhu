import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BASE_PATH } from '@/lib/base-path';
import { CustomDialogProvider } from './context/CustomDialogContext';
import { LoadingProvider } from './components/LoadingService';
import { AuthProvider } from './context/AuthContext';
import { isFirebaseConfigured } from './firebase';
import { withBase } from './utils/withBase';
import './index.css';
import './App.css';

// Cada página vira um chunk próprio: quem abre a inscrição não baixa o painel
// admin inteiro (exceljs, jspdf, html2canvas...).
const ClosedRegistrations = lazy(() => import('./pages/ClosedRegistrations'));
const Home = lazy(() => import('./pages/Home'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminInscritos = lazy(() => import('./pages/AdminInscritos'));
const AdminFinanceiro = lazy(() => import('./pages/AdminFinanceiro'));
const AdminKits = lazy(() => import('./pages/AdminKits'));
const AdminMensagens = lazy(() => import('./pages/AdminMensagens'));
const AdminMensagensConfig = lazy(() => import('./pages/AdminMensagensConfig'));
const AdminMensagensPersonalizadas = lazy(() => import('./pages/AdminMensagensPersonalizadas'));
const AdminMidias = lazy(() => import('./pages/AdminMidias'));
const AdminExport = lazy(() => import('./pages/AdminExport'));
const AdminCamisetas = lazy(() => import('./pages/AdminCamisetas'));
const AdminUsuarios = lazy(() => import('./pages/AdminUsuarios'));
const AdminSorteios = lazy(() => import('./pages/AdminSorteios'));
const AdminSorteioDetalhe = lazy(() => import('./pages/AdminSorteioDetalhe'));
const SorteioPublico = lazy(() => import('./pages/SorteioPublico'));
const SorteioOperador = lazy(() => import('./pages/SorteioOperador'));
const AdminLotes = lazy(() => import('./pages/AdminLotes'));
const AdminCuponsDesconto = lazy(() => import('./pages/AdminCuponsDesconto'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AtletaLayout = lazy(() => import('./layouts/AtletaLayout'));
const AtletaDashboard = lazy(() => import('./pages/AtletaDashboard'));
const AtletaLogin = lazy(() => import('./pages/AtletaLogin'));
const AtletaPagamentos = lazy(() => import('./pages/AtletaPagamentos'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const SuccessPaymentPage = lazy(() => import('./pages/SuccessPaymentPage'));
const Regulamento = lazy(() => import('./pages/Regulamento'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));
const AdminIntegracoes = lazy(() => import('./pages/AdminIntegracoes'));
const AdminModoManutencao = lazy(() => import('./pages/AdminModoManutencao'));
const AdminVerificarPagamentos = lazy(() => import('./pages/AdminVerificarPagamentos'));
const AdminCobrancaPendentes = lazy(() => import('./pages/AdminCobrancaPendentes'));
const AdminDev = lazy(() => import('./pages/AdminDev'));
const AdminAtletaDetalhes = lazy(() => import('./pages/AdminAtletaDetalhes'));
const AdminModalidades = lazy(() => import('./pages/AdminModalidades'));
const AdminEquipes = lazy(() => import('./pages/AdminEquipes'));
const AdminPresenca = lazy(() => import('./pages/AdminPresenca'));
const AdminCardEuVou = lazy(() => import('./pages/AdminCardEuVou'));
const AdminContaHistorico = lazy(() => import('./pages/AdminContaHistorico'));
const AdminFaturas = lazy(() => import('./pages/AdminFaturas'));
const AdminFinanceiroRelatorios = lazy(() => import('./pages/AdminFinanceiroRelatorios'));
const AdminFinanceiroDefinicoes = lazy(() => import('./pages/AdminFinanceiroDefinicoes'));

const Placeholder = ({ title }: { title: string }) => (
  <div style={{ padding: 20 }}>
    <h1>{title}</h1>
    <p>Em desenvolvimento...</p>
  </div>
);

// "/" é a landing da Corrida Flamanhu, servida pelo Next fora deste app. Um
// navigate('/') vindo de qualquer tela precisa de recarga completa para sair do SPA.
function GoToSite() {
  useEffect(() => {
    window.location.replace(withBase('/'));
  }, []);
  return null;
}

function SistemaNaoConfigurado() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, fontFamily: 'system-ui, sans-serif', background: '#0b0a0a', color: '#f4efea' }}>
      <div style={{ maxWidth: 520 }}>
        <h1 style={{ fontSize: 24, marginBottom: 12 }}>Sistema de inscrições ainda não configurado</h1>
        <p style={{ lineHeight: 1.5, opacity: 0.8 }}>
          Faltam as variáveis <code>NEXT_PUBLIC_FIREBASE_*</code>. Copie <code>.env.example</code> para{' '}
          <code>.env.local</code>, preencha com o projeto Firebase da Corrida Flamanhu e reinicie o servidor.
        </p>
        <p style={{ marginTop: 16 }}>
          <a href={withBase('/')} style={{ color: '#ff2e38' }}>Voltar ao site</a>
        </p>
      </div>
    </main>
  );
}

function App() {
  if (!isFirebaseConfigured) return <SistemaNaoConfigurado />;

  return (
    <BrowserRouter basename={BASE_PATH || undefined}>
      <LoadingProvider>
        <AuthProvider>
          <CustomDialogProvider>
            <Suspense fallback={null}>
              <Routes>
                {/* Site da Corrida Flamanhu (Next) */}
                <Route path="/" element={<GoToSite />} />

                {/* Public */}
                <Route path="/nightrun" element={<Home />} />
                <Route path="/regulamento" element={<Regulamento />} />
                <Route path="/inscricao" element={<ClosedRegistrations />} />
                <Route path="/inscricao/pagamento/:registrationId" element={<PaymentPage />} />
                <Route path="/inscricao/confirmada/:registrationId" element={<SuccessPaymentPage />} />
                <Route path="/sorteio/:sorteioId" element={<SorteioPublico />} />
                <Route path="/sorteio/:sorteioId/operar" element={<SorteioOperador />} />

                {/* Shared Login */}
                <Route path="/admin/login" element={<AtletaLogin />} />
                <Route path="/atleta/login" element={<AtletaLogin />} />

                {/* Admin */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="inscritos" element={<AdminInscritos />} />
                  <Route path="inscritos/:id" element={<AdminAtletaDetalhes />} />
                  <Route path="inscritos/novo" element={<Placeholder title="NOVA INSCRIÇÃO" />} />
                  <Route path="modalidades" element={<AdminModalidades />} />
                  <Route path="equipes" element={<AdminEquipes />} />
                  <Route path="financeiro" element={<AdminFinanceiro />} />
                  <Route path="financeiro/faturas" element={<AdminFaturas />} />
                  <Route path="financeiro/relatorios" element={<AdminFinanceiroRelatorios />} />
                  <Route path="financeiro/definicoes" element={<AdminFinanceiroDefinicoes />} />
                  <Route path="financeiro/:provider" element={<AdminContaHistorico />} />
                  <Route path="verificar-pagamentos" element={<AdminVerificarPagamentos />} />
                  <Route path="cobranca-pendentes" element={<AdminCobrancaPendentes />} />
                  <Route path="financeiro/cobrancas" element={<Placeholder title="COBRANÇAS" />} />
                  <Route path="kits" element={<AdminKits />} />
                  <Route path="presenca" element={<AdminPresenca />} />
                  <Route path="card-euvou" element={<AdminCardEuVou />} />
                  <Route path="mensagens" element={<AdminMensagens />} />
                  <Route path="whatsapp" element={<AdminMensagensConfig />} />
                  <Route path="mensagens/personalizadas" element={<AdminMensagensPersonalizadas />} />
                  <Route path="midias" element={<AdminMidias />} />
                  <Route path="export" element={<AdminExport />} />
                  <Route path="camisetas" element={<AdminCamisetas />} />
                  <Route path="usuarios" element={<AdminUsuarios />} />
                  <Route path="sorteios" element={<AdminSorteios />} />
                  <Route path="sorteios/:sorteioId" element={<AdminSorteioDetalhe />} />
                  <Route path="lotes" element={<AdminLotes />} />
                  <Route path="cupons" element={<AdminCuponsDesconto />} />
                  <Route path="integracoes" element={<AdminIntegracoes />} />
                  <Route path="modo-manutencao" element={<AdminModoManutencao />} />
                  <Route path="configuracoes" element={<AdminSettings />} />
                  <Route path="dev" element={<AdminDev />} />
                </Route>

                {/* Atleta */}
                <Route path="/atleta" element={<AtletaLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AtletaDashboard />} />
                  <Route path="pagamentos" element={<AtletaPagamentos />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<GoToSite />} />
              </Routes>
            </Suspense>
          </CustomDialogProvider>
        </AuthProvider>
      </LoadingProvider>
    </BrowserRouter>
  );
}

export default App;
