"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const ROTAS = [
  {
    id: "5k",
    nome: "5K",
    titulo: "Percurso rápido e dinâmico",
    texto: "Para quem quer velocidade — ideal para estreantes e para quem busca o recorde pessoal.",
    d: "M 80 330 C 70 250 140 200 210 225 C 280 250 320 300 390 285 C 470 268 480 180 545 160",
  },
  {
    id: "10k",
    nome: "10K",
    titulo: "Desafio para ir além dos limites",
    texto: "O percurso completo pelas ruas de Manhuaçu — subidas, retas e a energia da Nação em cada km.",
    d: "M 80 340 C 120 380 200 370 240 330 C 280 290 230 240 180 250 C 120 262 130 180 200 160 C 270 140 320 200 380 220 C 450 243 470 300 540 290 C 590 283 585 215 555 185",
  },
  {
    id: "caminhada",
    nome: "Caminhada",
    titulo: "Participe, caminhe e celebre!",
    texto: "Sem pressa e sem cronômetro: venha com a família viver a festa rubro-negra.",
    d: "M 90 320 C 160 300 220 312 280 290 C 350 266 400 272 460 240 C 510 214 532 192 555 170",
  },
];

export default function Percursos() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const paths = gsap.utils.toArray<SVGPathElement>(".rota__path");
        const grupos = gsap.utils.toArray<SVGGElement>(".rota");
        const cards = gsap.utils.toArray<HTMLElement>(".pcard");
        const runner = ".percursos__runner";

        // prepara o desenho de cada traçado
        paths.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap.set(grupos.slice(1), { autoAlpha: 0 });
        gsap.set(runner, { autoAlpha: 0 });

        const setActive = (i: number) =>
          cards.forEach((c, j) => c.classList.toggle("is-active", i === j));
        setActive(0);

        /* ---------- linha do tempo pinada, com snap por rota ---------- */
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=2600",
            pin: true,
            scrub: 0.6,
            snap: { snapTo: "labels", duration: { min: 0.2, max: 0.6 }, ease: "power1.inOut" },
            onUpdate(self) {
              setActive(Math.min(2, Math.floor(self.progress * 3)));
            },
          },
        });

        ROTAS.forEach((_, i) => {
          const grupo = grupos[i];
          const path = paths[i];

          tl.addLabel(`rota${i}`);

          if (i > 0) {
            // troca de rota: some a anterior, entra a próxima
            tl.to(grupos[i - 1], { autoAlpha: 0, duration: 0.25 });
            tl.to(grupo, { autoAlpha: 1, duration: 0.25 }, "<");
          }

          // desenha o traçado…
          tl.to(path, { strokeDashoffset: 0, duration: 1 });
          // …com o corredor seguindo o caminho
          tl.to(
            runner,
            {
              autoAlpha: 1,
              duration: 0.08,
              motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
            },
            "<",
          );
          tl.to(
            runner,
            { duration: 0.92, motionPath: { path, align: path, alignOrigin: [0.5, 0.5] } },
            "<+0.08",
          );

          // pequena pausa para "respirar" no snap
          tl.to({}, { duration: 0.3 });
        });
        tl.addLabel("fim");
      });

      /* ---------- movimento reduzido: mostra tudo, sem pin ---------- */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".rota", { autoAlpha: 1 });
        gsap.utils
          .toArray<HTMLElement>(".pcard")
          .forEach((c) => c.classList.add("is-active"));
      });
    },
    { scope: root },
  );

  return (
    <section className="percursos" id="percursos" ref={root}>
      <div className="percursos__inner">
        <div className="percursos__copy">
          <p className="section-eyebrow">
            <span className="eyebrow__dash" aria-hidden="true"></span>
            Percursos
          </p>
          <h2 className="section-title">Escolha seu desafio</h2>
          <p className="percursos__lead">
            Role para percorrer cada traçado — percursos planejados para
            performance, superação e belas paisagens de Manhuaçu e região.
          </p>

          <div className="percursos__cards">
            {ROTAS.map((r) => (
              <article className="pcard" key={r.id}>
                <span className="pcard__tag">{r.nome}</span>
                <div className="pcard__body">
                  <h3 className="pcard__title">{r.titulo}</h3>
                  <p className="pcard__text">{r.texto}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="percursos__stage" aria-hidden="true">
          <svg viewBox="0 0 640 420" className="percursos__svg">
            {/* grade de fundo, feel de mapa */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(244,239,234,0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="640" height="420" fill="url(#grid)" />

            {ROTAS.map((r, i) => (
              <g className="rota" data-rota={r.id} key={r.id}>
                {/* sombra do caminho completo */}
                <path d={r.d} className="rota__ghost" />
                {/* traçado que se desenha */}
                <path d={r.d} className={`rota__path rota__path--${i}`} />
                {/* largada */}
                <circle className="rota__start" r="7" cx={r.d.split(" ")[1]} cy={r.d.split(" ")[2]} />
                {/* chegada: bandeirada */}
                <g
                  className="rota__finish"
                  transform={`translate(${r.d.trim().split(/[\s,]+/).slice(-2)[0]}, ${r.d.trim().split(/[\s,]+/).slice(-2)[1]})`}
                >
                  <line x1="0" y1="4" x2="0" y2="-26" />
                  <path d="M0,-26 h20 v14 h-20 z" className="rota__flag" />
                  <path d="M0,-26 h5 v3.5 h5 v3.5 h-5 v3.5 h5 v3.5 h-10 z" className="rota__flag-checker" />
                </g>
              </g>
            ))}

            {/* corredor */}
            <g className="percursos__runner">
              <circle r="16" className="runner__pulse" />
              <circle r="7" className="runner__dot" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
