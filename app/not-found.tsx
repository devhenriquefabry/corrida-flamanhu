import SistemaApp from "@/sistema/SistemaApp";

// No export estático isto vira o 404.html. O Firebase Hosting o serve (com
// status 200, via rewrite em firebase.json) para toda URL sem arquivo —
// inclusive as rotas com parâmetro do sistema (/inscricao/pagamento/:id,
// /admin/inscritos/:id...) —, então o SPA monta e o React Router decide: rota
// conhecida renderiza, desconhecida volta para "/".
export default function NotFound() {
  return <SistemaApp />;
}
