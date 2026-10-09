import type { Metadata } from "next";
import { Anton, Barlow, Barlow_Condensed } from "next/font/google";
import { BASE_PATH } from "@/lib/base-path";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-barlow-cond",
  display: "swap",
});

const barlow = Barlow({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Corrida Flamanhu 2027 — A Nação Rubro-Negra corre unida em Manhuaçu",
  description:
    "Corrida Flamanhu 2027: percursos de 5K e 10K em Manhuaçu-MG. Corra, caminhe e celebre com a Nação Rubro-Negra. Inscreva-se!",
  icons: {
    icon: `${BASE_PATH}/assets/logo-flamanhu.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${anton.variable} ${barlowCondensed.variable} ${barlow.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
