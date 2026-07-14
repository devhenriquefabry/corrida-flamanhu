"use client";

import { useEffect, useRef, useState } from "react";
import { BASE_PATH } from "@/lib/base-path";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [kitOpen, setKitOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // barra de progresso da página (scrub no documento inteiro)
  useGSAP(() => {
    gsap.to(progressRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        start: 0,
        end: () => document.documentElement.scrollHeight - window.innerHeight,
        scrub: 0.3,
      },
    });
  });

  // fio rubro + fundo sólido ao rolar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // fecha dropdown ao clicar fora e menus com Esc
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setKitOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setKitOpen(false);
        setMenuOpen((open) => {
          if (open) burgerRef.current?.focus();
          return false;
        });
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // fecha o menu mobile ao navegar
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`navbar${scrolled ? " is-scrolled" : ""}`} id="navbar">
      <div className="navbar__inner">
        <a href="#" className="navbar__brand" aria-label="Corrida Flamanhu — Início">
          <img
            src={`${BASE_PATH}/assets/logo-flamanhu.svg`}
            alt=""
            width={52}
            height={52}
            className="navbar__logo"
          />
          <span className="navbar__brand-text">
            <strong>FLAMANHU</strong>
            <small>Manhuaçu · MG</small>
          </span>
        </a>

        <nav
          className={`navbar__nav${menuOpen ? " is-open" : ""}`}
          id="menu"
          aria-label="Navegação principal"
        >
          <ul className="navbar__list">
            <li>
              <a className="navbar__link is-active" href="#" aria-current="page" onClick={closeMenu}>
                Home
              </a>
            </li>
            <li>
              <a className="navbar__link" href="#evento" onClick={closeMenu}>
                O Evento
              </a>
            </li>
            <li>
              <a className="navbar__link" href="#percursos" onClick={closeMenu}>
                Percursos
              </a>
            </li>
            <li>
              <a className="navbar__link" href="#programacao" onClick={closeMenu}>
                Programação
              </a>
            </li>
            <li
              ref={dropdownRef}
              className={`navbar__item--dropdown${kitOpen ? " is-open" : ""}`}
            >
              <button
                className="navbar__link navbar__link--btn"
                aria-expanded={kitOpen}
                aria-controls="submenu-kit"
                onClick={() => setKitOpen((open) => !open)}
              >
                Kit
                <svg
                  className="caret"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <ul className="navbar__submenu" id="submenu-kit">
                <li>
                  <a href="#kit" onClick={closeMenu}>Kit do Atleta</a>
                </li>
                <li>
                  <a href="#retirada" onClick={closeMenu}>Retirada do Kit</a>
                </li>
              </ul>
            </li>
            <li>
              <a className="navbar__link" href="#informacoes" onClick={closeMenu}>
                Informações
              </a>
            </li>
          </ul>

          <a href="#inscricao" className="btn btn--primary navbar__cta--mobile" onClick={closeMenu}>
            <span className="btn__label">Inscreva-se</span>
          </a>
        </nav>

        <a href="#inscricao" className="btn btn--primary navbar__cta">
          <svg
            className="btn__icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M13 4v6h6" />
            <path d="m19 10-8.5 8.5a2.12 2.12 0 0 1-3-3L16 7" />
            <path d="M5 20h9" />
          </svg>
          <span className="btn__label">Inscreva-se</span>
        </a>

        <button
          ref={burgerRef}
          className="navbar__burger"
          id="burger"
          aria-expanded={menuOpen}
          aria-controls="menu"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* progresso de leitura da página */}
      <div className="navbar__progress" ref={progressRef} aria-hidden="true"></div>
    </header>
  );
}
