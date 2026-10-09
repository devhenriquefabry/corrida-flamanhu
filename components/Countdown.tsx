"use client";

import { useEffect, useState } from "react";
import { EVENTO } from "@/lib/evento";

const ALVO = new Date(EVENTO.largadaISO).getTime();

const dois = (n: number) => String(n).padStart(2, "0");

function restante() {
  const ms = Math.max(0, ALVO - Date.now());
  const s = Math.floor(ms / 1000);
  return {
    acabou: ms === 0,
    dias: Math.floor(s / 86400),
    horas: Math.floor((s % 86400) / 3600),
    min: Math.floor((s % 3600) / 60),
    seg: s % 60,
  };
}

// Só calcula depois de montar: o HTML estático não pode carregar a data do build.
export default function Countdown() {
  const [t, setT] = useState<ReturnType<typeof restante> | null>(null);

  useEffect(() => {
    setT(restante());
    const id = window.setInterval(() => setT(restante()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const itens = t
    ? [
        { v: String(t.dias), l: t.dias === 1 ? "dia" : "dias" },
        { v: dois(t.horas), l: "horas" },
        { v: dois(t.min), l: "min" },
        { v: dois(t.seg), l: "seg" },
      ]
    : [
        { v: "--", l: "dias" },
        { v: "--", l: "horas" },
        { v: "--", l: "min" },
        { v: "--", l: "seg" },
      ];

  return (
    <div className="count" aria-label="Contagem regressiva para a largada">
      <p className="count__label">{t?.acabou ? "A largada já aconteceu" : "Faltam para a largada"}</p>
      <p className="sr-only">
        {t && !t.acabou ? `Faltam ${t.dias} dias para a largada, em ${EVENTO.dataLonga}.` : ""}
      </p>
      <ol className="count__grid" aria-hidden="true">
        {itens.map((i) => (
          <li key={i.l}>
            <strong>{i.v}</strong>
            <span>{i.l}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
