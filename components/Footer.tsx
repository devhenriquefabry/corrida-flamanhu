"use client";

import { useRef } from "react";
import { BASE_PATH } from "@/lib/base-path";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".footer__col", {
          autoAlpha: 0,
          y: 34,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <footer className="footer" id="informacoes" ref={root}>
      <div className="footer__inner">
        <div className="footer__col footer__col--brand">
          <div className="footer__brand">
            <img
              src={`${BASE_PATH}/assets/logo-flamanhu.svg`}
              alt=""
              width={64}
              height={64}
              className="footer__logo"
            />
            <div>
              <strong>FLAMANHU</strong>
              <small>Manhuaçu · MG</small>
            </div>
          </div>
          <p className="footer__desc">
            A Nação Rubro-Negra corre unida em Manhuaçu e região.
          </p>
        </div>

        <div className="footer__col" id="retirada">
          <h3 className="footer__heading">Siga a Nação</h3>
          <ul className="footer__social">
            <li>
              <a href="#" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <path d="M17.5 6.5h.01" />
                </svg>
              </a>
            </li>
            <li>
              <a href="#" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </li>
            <li>
              <a href="#" aria-label="TikTok">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 12a4 4 0 1 0 4 4V4c.4 1.5 1.8 4 5 4.5" />
                </svg>
              </a>
            </li>
            <li>
              <a href="#" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22.5 8.5a3 3 0 0 0-2-2.1C18.9 6 12 6 12 6s-6.9 0-8.5.4a3 3 0 0 0-2 2.1A31 31 0 0 0 1 12a31 31 0 0 0 .5 3.5 3 3 0 0 0 2 2.1C5.1 18 12 18 12 18s6.9 0 8.5-.4a3 3 0 0 0 2-2.1A31 31 0 0 0 23 12a31 31 0 0 0-.5-3.5z" />
                  <path d="m10 9.5 5 2.5-5 2.5z" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </li>
          </ul>
          <p className="footer__hashtag">#CorridaFLAMANHU2026</p>
        </div>

        <div className="footer__col">
          <h3 className="footer__heading">Informações</h3>
          <ul className="footer__info">
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-10 6L2 7" />
              </svg>
              <a href="mailto:contato@corridaflamanhu.com.br">contato@corridaflamanhu.com.br</a>
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3A19.5 19.5 0 0 1 5.2 13 19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z" />
              </svg>
              <a href="tel:+5533999990000">(33) 9 9999-0000</a>
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Manhuaçu · MG
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h3 className="footer__heading">Realização</h3>
          <p className="footer__real">
            Nação — Embaixadas e Comunidades
            <br />
            <small>Manhuaçu e região</small>
          </p>
        </div>
      </div>

      <div className="footer__bar">
        <p>© 2026 Corrida FLAMANHU. Todos os direitos reservados.</p>
        <p>Este evento não tem vínculo com o Clube de Regatas do Flamengo.</p>
      </div>
    </footer>
  );
}
