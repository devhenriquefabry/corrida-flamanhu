"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { BASE_PATH } from "@/lib/base-path";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// three.js só carrega no cliente — mantém o export estático leve
const FlagCanvas = dynamic(() => import("./FlagCanvas"), { ssr: false });

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ---------- intro: a Nação entra em campo ---------- */
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".hero__eyebrow", { autoAlpha: 0, x: -36, duration: 0.7 })
          .from(
            ".hero__title-line",
            {
              autoAlpha: 0,
              y: 90,
              skewY: 4,
              duration: 0.9,
              stagger: 0.14,
              clearProps: "skewY",
            },
            "-=0.35",
          )
          .from(".year__slashes i", { scaleY: 0, transformOrigin: "bottom", stagger: 0.08, duration: 0.4 }, "<+0.2")
          .from(".hero__sub", { autoAlpha: 0, y: 26, duration: 0.7 }, "-=0.5")
          .from(".hero__actions .btn", { autoAlpha: 0, y: 22, stagger: 0.12, duration: 0.55 }, "-=0.45")
          .from(".hero__visual", { autoAlpha: 0, scale: 0.82, duration: 1.1, ease: "back.out(1.6)" }, 0.5)
          .from(".hero__cards .card", { autoAlpha: 0, y: 40, stagger: 0.09, duration: 0.6 }, "-=0.7");

        /* ---------- parallax de saída (scrub) ---------- */
        gsap.to(".hero__copy", {
          yPercent: -14,
          autoAlpha: 0.25,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom 35%",
            scrub: true,
          },
        });
        gsap.to(".hero__visual", {
          yPercent: 16,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(".hero__canvas", {
          yPercent: 22,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        /* ---------- ticker que reage à velocidade do scroll ---------- */
        const marquee = gsap.to(".ticker__track", {
          xPercent: -50,
          ease: "none",
          duration: 24,
          repeat: -1,
        });
        const clampTs = gsap.utils.clamp(-4, 4);
        ScrollTrigger.create({
          onUpdate(self) {
            const boost = clampTs(self.getVelocity() / 260);
            // acelera na direção do scroll…
            marquee.timeScale(Math.abs(boost) < 1 ? Math.sign(boost) || 1 : boost);
            // …e volta suavemente à velocidade de cruzeiro
            gsap.to(marquee, { timeScale: 1, duration: 1.1, delay: 0.25, overwrite: true });
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section className="hero" id="inicio" ref={root}>
      {/* camadas de atmosfera */}
      <div className="hero__atmo" aria-hidden="true">
        <div className="hero__glow hero__glow--flare"></div>
        <div className="hero__glow hero__glow--ground"></div>
        <FlagCanvas />
        <div className="hero__stripes"></div>
        <div className="hero__grain"></div>
      </div>

      <div className="hero__inner">
        <div className="hero__copy">
          <p className="hero__eyebrow">
            <span className="eyebrow__tag">Manhuaçu · MG</span>
            <span className="eyebrow__line" aria-hidden="true"></span>
            <span>Corrida de rua oficial da torcida</span>
          </p>

          <h1 className="hero__title">
            <span className="hero__title-line hero__title-line--outline">
              Corrida
            </span>
            <span className="hero__title-line hero__title-line--solid">
              Flamanhu
            </span>
            <span className="hero__title-line hero__title-line--year">
              <span className="year__slashes" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
              </span>
              2027
            </span>
          </h1>

          <p className="hero__sub">
            A Nação Rubro-Negra corre unida em Manhuaçu e região. Corrida de{" "}
            <strong>5K e 10K</strong> e <strong>caminhada</strong> para todos os
            níveis — do atleta ao torcedor de arquibancada.
          </p>

          <div className="hero__actions">
            <a href="#inscricao" className="btn btn--primary btn--lg">
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
            <a href="#percursos" className="btn btn--ghost btn--lg">
              <span className="btn__label">Conheça os percursos</span>
            </a>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hero__badge-glow"></div>
          <img
            src={`${BASE_PATH}/assets/logo-corrida-flamanhu.webp`}
            alt=""
            className="hero__badge"
            width={800}
            height={731}
          />
        </div>
      </div>

      {/* cards informativos */}
      <div className="hero__cards">
        <article className="card">
          <div className="card__icon" aria-hidden="true">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z" fill="currentColor" />
              <path d="m14 7-3 5 3 2v6" />
              <path d="m8.5 10 2-2.5L14 7l3 3 2.5.5" />
              <path d="M7.5 21 10 16l-2-1.5" />
            </svg>
          </div>
          <div className="card__body">
            <h2 className="card__title">5K e 10K</h2>
            <p className="card__text">Corridas para todos os níveis</p>
          </div>
        </article>

        <article className="card">
          <div className="card__icon" aria-hidden="true">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
            </svg>
          </div>
          <div className="card__body">
            <h2 className="card__title">Kit do Atleta</h2>
            <p className="card__text">Itens exclusivos para cada inscrito</p>
          </div>
        </article>

        <article className="card">
          <div className="card__icon" aria-hidden="true">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="card__body">
            <h2 className="card__title">Evento para toda a torcida</h2>
            <p className="card__text">Corra, caminhe e celebre com a Nação</p>
          </div>
        </article>

        <article className="card">
          <div className="card__icon" aria-hidden="true">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M16 2v4" />
              <path d="M8 2v4" />
              <path d="M3 10h18" />
              <path d="M8 14h.01" />
              <path d="M12 14h.01" />
              <path d="M16 14h.01" />
              <path d="M8 18h.01" />
              <path d="M12 18h.01" />
            </svg>
          </div>
          <div className="card__body">
            <h2 className="card__title">Em breve</h2>
            <p className="card__text">Mais informações e novidades</p>
          </div>
        </article>
      </div>

      {/* letreiro rubro-negro */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          <span className="ticker__seq">
            <em>5K</em> ✦ <em>10K</em> ✦ Caminhada ✦ Manhuaçu · MG ✦ Uma vez
            Flamengo, sempre Flamengo ✦ Kit do atleta ✦
          </span>
          <span className="ticker__seq">
            <em>5K</em> ✦ <em>10K</em> ✦ Caminhada ✦ Manhuaçu · MG ✦ Uma vez
            Flamengo, sempre Flamengo ✦ Kit do atleta ✦
          </span>
        </div>
      </div>
    </section>
  );
}
