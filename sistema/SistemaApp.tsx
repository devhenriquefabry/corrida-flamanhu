"use client";

import dynamic from "next/dynamic";

// O sistema de inscrições (vindo do projeto Vite) é um SPA com React Router,
// Firebase e window/localStorage por toda parte — roda só no navegador.
const App = dynamic(() => import("./src/App"), { ssr: false });

export default function SistemaApp() {
  return <App />;
}
