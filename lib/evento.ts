import { BASE_PATH } from "@/lib/base-path";

// Dados do evento usados na landing. Datas, horários e valores vêm do
// regulamento (regulamento/conteudo.mjs) — mude nos dois lugares.
export const EVENTO = {
  nome: "Corrida Flamanhu 2027",
  // largada oficial: 15/05/2027, 09h (Brasília)
  largadaISO: "2027-05-15T09:00:00-03:00",
  dataCurta: "15.05.2027",
  dataLonga: "15 de maio de 2027",
  diaSemana: "sábado",
  concentracao: "07h30",
  largada: "09h00",
  local: "Praça Cordovil Pinto Coelho",
  bairro: "Centro · Manhuaçu/MG",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Pra%C3%A7a+Cordovil+Pinto+Coelho+Manhua%C3%A7u+MG",
  instagramUrl: "https://www.instagram.com/corrida_flamanhu",
  instagramUser: "@corrida_flamanhu",
  email: "corridaflamanhu@gmail.com",
  inscricaoUrl: `${BASE_PATH}/inscricao`,
  regulamentoUrl: `${BASE_PATH}/regulamento`,
  // mesmo projeto Firebase do sistema de inscrições
  firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "corrida-flamanhu",
} as const;

export const NAV = [
  { href: "#provas", label: "Provas" },
  { href: "#programacao", label: "Dia da prova" },
  { href: "#premiacao", label: "Kit e prêmios" },
  { href: "#como-participar", label: "Como participar" },
  { href: "#duvidas", label: "Dúvidas" },
] as const;
