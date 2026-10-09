"use client";

import { useEffect, useRef, useState } from "react";
import { BASE_PATH } from "@/lib/base-path";
import { EVENTO, NAV } from "@/lib/evento";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [aberto, setAberto] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const painelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // menu aberto: trava a rolagem, fecha com Esc e devolve o foco ao botão
  useEffect(() => {
    if (!aberto) return;
    document.documentElement.classList.add("no-scroll");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        burgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    painelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.documentElement.classList.remove("no-scroll");
      document.removeEventListener("keydown", onKey);
    };
  }, [aberto]);

  // voltou para telas largas com o menu aberto: fecha
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 960px)");
    const onChange = () => mq.matches && setAberto(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const fechar = () => setAberto(false);

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}${aberto ? " is-open" : ""}`}>
      <div className="nav__bar wrap">
        <a href="#inicio" className="nav__brand" aria-label="Corrida Flamanhu — início" onClick={fechar}>
          <img src={`${BASE_PATH}/assets/logo-flamanhu-sm.webp`} alt="" width={44} height={44} />
          <span>
            Flamanhu
            <small>Manhuaçu · MG</small>
          </span>
        </a>

        <nav className="nav__links" aria-label="Navegação principal">
          {NAV.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <a href={EVENTO.inscricaoUrl} className="btn btn--primary btn--sm nav__cta">
          Inscreva-se
        </a>

        <button
          ref={burgerRef}
          type="button"
          className="nav__burger"
          aria-expanded={aberto}
          aria-controls="menu-mobile"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          onClick={() => setAberto((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div id="menu-mobile" ref={painelRef} className="nav__panel" inert={!aberto}>
        <nav aria-label="Navegação principal (celular)">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} onClick={fechar}>
              {l.label}
            </a>
          ))}
        </nav>
        <a href={EVENTO.inscricaoUrl} className="btn btn--primary btn--lg" onClick={fechar}>
          Quero me inscrever
        </a>
        <p className="nav__panel-data">
          {EVENTO.dataLonga} · {EVENTO.local}
        </p>
      </div>
    </header>
  );
}
