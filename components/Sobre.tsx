"use client";

import { useRef } from "react";
import { BASE_PATH } from "@/lib/base-path";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

export default function Sobre() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ---------- título: reveal linha a linha (SplitText) ---------- */
        const split = SplitText.create(".sobre__title", {
          type: "lines",
          linesClass: "sobre__line",
          mask: "lines",
        });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".sobre__title", start: "top 78%", once: true },
        });

        /* ---------- textos e tagline ---------- */
        gsap.from([".sobre__eyebrow", ".sobre__text", ".sobre__tagline"], {
          autoAlpha: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
        });

        /* ---------- visual: splash + escudo + anel girando ---------- */
        gsap.from(".sobre__splash", {
          scale: 0,
          rotate: -30,
          duration: 1.1,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: ".sobre__visual", start: "top 75%", once: true },
        });
        gsap.from(".sobre__badge", {
          autoAlpha: 0,
          y: 60,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".sobre__visual", start: "top 70%", once: true },
        });
        // anel de texto gira para sempre + acelera levemente com o scroll
        gsap.to(".sobre__ring", { rotate: 360, duration: 28, ease: "none", repeat: -1 });
        gsap.to(".sobre__visual", {
          y: -34,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        /* ---------- contadores 5 · 10 ---------- */
        gsap.utils.toArray<HTMLElement>(".sobre__stat-num[data-count]").forEach((el) => {
          const target = Number(el.dataset.count);
          const proxy = { v: 0 };
          gsap.to(proxy, {
            v: target,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
            onUpdate() {
              el.textContent = String(Math.round(proxy.v));
            },
          });
        });
        gsap.from(".sobre__stat", {
          autoAlpha: 0,
          y: 30,
          stagger: 0.1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: ".sobre__stats", start: "top 85%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section className="sobre" id="evento" ref={root}>
      <div className="sobre__inner">
        <div className="sobre__copy">
          <p className="sobre__eyebrow section-eyebrow">
            <span className="eyebrow__dash" aria-hidden="true"></span>
            Sobre o evento
          </p>

          <h2 className="sobre__title section-title">
            Um evento para correr, torcer e celebrar
          </h2>

          <p className="sobre__text">
            A Corrida <strong>FLAMANHU 2027</strong> reúne a Nação Rubro-Negra de
            Manhuaçu e região para um dia de esporte, superação e paixão pelo
            Mengão. Mais que uma corrida, é uma experiência que celebra nossa
            história, nossa luta e nossa união.
          </p>

          <p className="sobre__tagline">
            Vista o manto. Sinta a energia. <em>Seja Flamanhu!</em>
          </p>

          <ul className="sobre__stats">
            <li className="sobre__stat">
              <span className="sobre__stat-num-wrap">
                <span className="sobre__stat-num" data-count="5">0</span>K
              </span>
              <span className="sobre__stat-label">Percurso rápido e dinâmico</span>
            </li>
            <li className="sobre__stat">
              <span className="sobre__stat-num-wrap">
                <span className="sobre__stat-num" data-count="10">0</span>K
              </span>
              <span className="sobre__stat-label">Desafio para ir além</span>
            </li>
            <li className="sobre__stat">
              <span className="sobre__stat-num-wrap">
                <span className="sobre__stat-num sobre__stat-num--walk">+</span>
              </span>
              <span className="sobre__stat-label">Caminhada para toda a família</span>
            </li>
          </ul>
        </div>

        <div className="sobre__visual" aria-hidden="true">
          <div className="sobre__splash"></div>

          {/* anel de texto girando */}
          <svg className="sobre__ring" viewBox="0 0 300 300">
            <defs>
              <path
                id="ringPath"
                d="M150,150 m -118,0 a 118,118 0 1,1 236,0 a 118,118 0 1,1 -236,0"
              />
            </defs>
            <text>
              <textPath href="#ringPath" startOffset="0">
                NAÇÃO RUBRO-NEGRA ✦ MANHUAÇU · MG ✦ CORRIDA FLAMANHU 2027 ✦
              </textPath>
            </text>
          </svg>

          <img
            src={`${BASE_PATH}/assets/logo-flamanhu.svg`}
            alt=""
            className="sobre__badge"
            width={300}
            height={300}
          />
        </div>
      </div>
    </section>
  );
}
