"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const ETAPAS = [
  {
    hora: "06h30",
    titulo: "Concentração",
    texto: "Recepção e aquecimento da Nação",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 21V4" />
        <path d="M4 4c3-1.5 6 1.5 9 0s5-1 7 0v9c-2-1-4-1.5-7 0s-6-1.5-9 0" />
      </svg>
    ),
  },
  {
    hora: "08h00",
    titulo: "Largada",
    texto: "A largada da Corrida FLAMANHU 2026",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z" fill="currentColor" />
        <path d="m14 7-3 5 3 2v6" />
        <path d="m8.5 10 2-2.5L14 7l3 3 2.5.5" />
        <path d="M7.5 21 10 16l-2-1.5" />
      </svg>
    ),
  },
  {
    hora: "11h00",
    titulo: "Premiação",
    texto: "Premiação geral e por faixa etária",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 21h8m-4-4v4M7 4h10v6a5 5 0 0 1-10 0z" />
        <path d="M7 6H4a1 1 0 0 0-1 1c0 2.5 1.5 4 4 4.5M17 6h3a1 1 0 0 1 1 1c0 2.5-1.5 4-4 4.5" />
      </svg>
    ),
  },
  {
    hora: "11h30",
    titulo: "Celebração",
    texto: "Música, festa e muita comemoração!",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M9 4.5c1 2.5 1 12.5 0 15M15 4.5c-1 2.5-1 12.5 0 15M3.5 9.5h17M3.5 14.5h17" />
      </svg>
    ),
  },
];

export default function Programacao() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* ---------- desktop: jornada horizontal pinada ---------- */
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.current!.querySelector<HTMLElement>(".prog__track")!;
        const getDist = () => track.scrollWidth - window.innerWidth;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${getDist() + 400}`,
            pin: true,
            scrub: 0.7,
            snap: 1 / (ETAPAS.length - 1),
            invalidateOnRefresh: true,
          },
        });

        tl.to(track, { x: () => -getDist(), ease: "none" });

        // linha de progresso + corredor que avança junto
        gsap.to(".prog__line-fill", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${getDist() + 400}`,
            scrub: 0.7,
          },
        });

        // cada painel dá um "respiro" de entrada enquanto desliza
        gsap.utils.toArray<HTMLElement>(".prog__panel").forEach((panel) => {
          gsap.from(panel.querySelector(".prog__panel-inner"), {
            autoAlpha: 0.35,
            scale: 0.94,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tl,
              start: "left 80%",
              end: "left 40%",
              scrub: true,
            },
          });
        });
      });

      /* ---------- mobile / movimento reduzido: timeline vertical ---------- */
      mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".prog__panel").forEach((panel, i) => {
          gsap.from(panel, {
            autoAlpha: 0,
            y: 50,
            duration: 0.7,
            delay: (i % 2) * 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger: panel, start: "top 85%", once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section className="prog" id="programacao" ref={root}>
      <div className="prog__head">
        <p className="section-eyebrow section-eyebrow--center">Programação</p>
        <h2 className="section-title section-title--center">Jornada da Nação</h2>
      </div>

      {/* linha de progresso */}
      <div className="prog__line" aria-hidden="true">
        <div className="prog__line-fill"></div>
      </div>

      <div className="prog__viewport">
        <div className="prog__track">
          {ETAPAS.map((e, i) => (
            <div className="prog__panel" key={e.titulo}>
              <div className="prog__panel-inner">
                <span className="prog__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="prog__icon" aria-hidden="true">{e.icon}</div>
                <span className="prog__hora">{e.hora}</span>
                <h3 className="prog__titulo">{e.titulo}</h3>
                <p className="prog__texto">{e.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
