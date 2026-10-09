import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Figtree } from "next/font/google";
import { BASE_PATH } from "@/lib/base-path";

// Títulos e números: condensada e alta, no estilo de número de peito.
const display = Big_Shoulders({
  axes: ["opsz"], // tamanho óptico: títulos grandes ficam mais firmes
  adjustFontFallback: false, // o Next não tem métricas desta fonte; evita o aviso no build
  subsets: ["latin"],
  variable: "--ff-display",
  display: "swap",
});

const body = Figtree({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--ff-body",
  display: "swap",
});

const TITULO = "Corrida Flamanhu 2027 — 15 de maio em Manhuaçu/MG";
const DESCRICAO =
  "5K, 10K, caminhada e Kids no dia 15 de maio de 2027, na Praça Cordovil Pinto Coelho, em Manhuaçu/MG. R$ 4.800 em prêmios. Veja as provas e inscreva-se.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  openGraph: {
    title: TITULO,
    description: DESCRICAO,
    locale: "pt_BR",
    type: "website",
  },
  icons: {
    icon: `${BASE_PATH}/assets/favicon.png`,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
