"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

const BENEFICIOS = [
  {
    titulo: "Camisa Temática",
    texto: "Design exclusivo Corrida FLAMANHU 2027",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
      </svg>
    ),
  },
  {
    titulo: "Medalha Exclusiva",
    texto: "Para todos que cruzarem a linha de chegada",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="15" r="6" />
        <path d="M9 9.5 5.5 3h4L12 7l2.5-4h4L15 9.5" />
        <path d="m12 12.5 1 2h2l-1.6 1.4.6 2.1-2-1.3-2 1.3.6-2.1L9 14.5h2z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    titulo: "Arena do Torcedor",
    texto: "Música, ativações e muita energia rubro-negra",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11v2a2 2 0 0 0 2 2h1l3 5 1.5-1-2-4H19a2 2 0 0 0 2-2v-2" />
        <path d="M5 11V7a7 7 0 0 1 14 0v4" />
        <path d="M9 11V8m3 3V6m3 5V8" />
      </svg>
    ),
  },
  {
    titulo: "Experiência Rubro-Negra",
    texto: "Ambiente feito para a Nação viver momentos inesquecíveis",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-7-4.5-9.3-9A5.5 5.5 0 0 1 12 6.3 5.5 5.5 0 0 1 21.3 12C19 16.5 12 21 12 21z" />
        <path d="m9 11 2 2 4-4" />
      </svg>
    ),
  },
];

export default function Beneficios() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ---------- título ---------- */
        const split = SplitText.create(".beneficios__title", {
          type: "lines",
          mask: "lines",
        });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".beneficios__title", start: "top 82%", once: true },
        });
        gsap.from(".beneficios__eyebrow", {
          autoAlpha: 0,
          y: 20,
          duration: 0.6,
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });

        /* ---------- entrada dos cards em lote ---------- */
        gsap.set(".bcard", { autoAlpha: 0, y: 64, rotateX: -8 });
        ScrollTrigger.batch(".bcard", {
          start: "top 86%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              rotateX: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: "power3.out",
            }),
        });
      });

      /* ---------- tilt 3D magnético (desktop, com mouse) ---------- */
      mm.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
        gsap.utils.toArray<HTMLElement>(".bcard").forEach((card) => {
          const rx = gsap.quickTo(card, "rotationX", { duration: 0.45, ease: "power2.out" });
          const ry = gsap.quickTo(card, "rotationY", { duration: 0.45, ease: "power2.out" });

          const onMove = (e: MouseEvent) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            ry(px * 14);
            rx(-py * 12);
            // brilho segue o mouse
            card.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
            card.style.setProperty("--my", `${(py + 0.5) * 100}%`);
          };
          const onLeave = () => {
            rx(0);
            ry(0);
          };

          card.addEventListener("mousemove", onMove);
          card.addEventListener("mouseleave", onLeave);
          return () => {
            card.removeEventListener("mousemove", onMove);
            card.removeEventListener("mouseleave", onLeave);
          };
        });
      });
    },
    { scope: root },
  );

  return (
    <section className="beneficios" id="kit" ref={root}>
      <div className="beneficios__inner">
        <p className="beneficios__eyebrow section-eyebrow section-eyebrow--center">
          O que te espera
        </p>
        <h2 className="beneficios__title section-title section-title--center">
          Benefícios do Atleta
        </h2>

        <div className="beneficios__grid">
          {BENEFICIOS.map((b) => (
            <article className="bcard" key={b.titulo}>
              <div className="bcard__glare" aria-hidden="true"></div>
              <div className="bcard__icon" aria-hidden="true">{b.icon}</div>
              <h3 className="bcard__title">{b.titulo}</h3>
              <p className="bcard__text">{b.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
