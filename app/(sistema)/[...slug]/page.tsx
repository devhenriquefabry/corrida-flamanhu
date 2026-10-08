import SistemaApp from "@/sistema/SistemaApp";
import { ROTAS_ESTATICAS } from "@/sistema/rotas";

// Qualquer caminho fora da lista cai no not-found, que também monta o SPA.
export const dynamicParams = false;

export function generateStaticParams() {
  return ROTAS_ESTATICAS.map((rota) => ({ slug: rota.split("/") }));
}

export default function SistemaPage() {
  return <SistemaApp />;
}
