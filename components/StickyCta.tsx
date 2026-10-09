"use client";

import { useEffect, useState } from "react";
import { EVENTO } from "@/lib/evento";

// Barra fixa de inscrição só no celular: aparece depois do botão do hero e some
// quando o CTA final já está na tela.
export default function StickyCta() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    // some da tela o botão de inscrição do hero: a barra assume
    const hero = document.querySelector<HTMLElement>(".hero__cta");
    const final = document.getElementById("inscreva-se");
    let passouHero = false;
    let noFinal = false;
    const atualiza = () => setVisivel(passouHero && !noFinal);

    const ioHero = new IntersectionObserver(([e]) => {
      passouHero = !e.isIntersecting;
      atualiza();
    });
    const ioFinal = new IntersectionObserver(([e]) => {
      noFinal = e.isIntersecting;
      atualiza();
    });
    if (hero) ioHero.observe(hero);
    if (final) ioFinal.observe(final);
    return () => {
      ioHero.disconnect();
      ioFinal.disconnect();
    };
  }, []);

  return (
    <div className={`sticky-cta${visivel ? " is-visible" : ""}`} aria-hidden={!visivel}>
      <p>
        <strong>{EVENTO.dataCurta}</strong>
        <span>Manhuaçu · MG</span>
      </p>
      <a className="btn btn--primary" href={EVENTO.inscricaoUrl} tabIndex={visivel ? 0 : -1}>
        Quero me inscrever
      </a>
    </div>
  );
}
