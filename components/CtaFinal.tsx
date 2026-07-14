"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

export default function CtaFinal() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ---------- título: explosão de caracteres ---------- */
        const split = SplitText.create(".cta__title", { type: "chars,words" });
        gsap.from(split.chars, {
          autoAlpha: 0,
          y: 60,
          rotateX: -75,
          duration: 0.7,
          stagger: { each: 0.02, from: "start" },
          ease: "back.out(1.5)",
          scrollTrigger: { trigger: ".cta__title", start: "top 80%", once: true },
        });

        /* ---------- sweep de luz atravessando a seção ---------- */
        gsap.fromTo(
          ".cta__sweep",
          { xPercent: -120 },
          {
            xPercent: 120,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );

        /* ---------- monograma parallax ---------- */
        gsap.to(".cta__mono", {
          yPercent: -30,
          rotate: 8,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        /* ---------- CTA + selos ---------- */
        gsap.from([".cta__action", ".cta__badges"], {
          autoAlpha: 0,
          y: 30,
          duration: 0.7,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: { trigger: ".cta__action", start: "top 88%", once: true },
        });

        /* pulso contínuo no botão */
        gsap.to(".cta__action .btn", {
          boxShadow: "0 8px 44px rgba(255, 46, 56, 0.65)",
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { scope: root },
  );

  return (
    <section className="cta" id="inscricao" ref={root}>
      <div className="cta__sweep" aria-hidden="true"></div>
      <span className="cta__mono" aria-hidden="true">CRF</span>

      <div className="cta__inner">
        <h2 className="cta__title">
          Garanta sua vaga na <em>largada da Nação!</em>
        </h2>

        <div className="cta__action">
          <a href="#" className="btn btn--primary btn--lg">
            <span className="btn__label">Quero me inscrever</span>
            <svg
              className="btn__icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </a>
        </div>

        <ul className="cta__badges">
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect width="18" height="11" x="3" y="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Inscrição segura
          </li>
          <li aria-hidden="true" className="cta__badge-sep">|</li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
            Em até 6x sem juros*
          </li>
        </ul>
      </div>
    </section>
  );
}
