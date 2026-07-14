"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const NAV_OFFSET = -76;

/**
 * Scroll suave global (Lenis) sincronizado com o ScrollTrigger.
 * Também intercepta âncoras internas para rolar com offset da navbar.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.11 });
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href === "#") {
        e.preventDefault();
        lenis.scrollTo(0);
        return;
      }
      const el = document.querySelector<HTMLElement>(href);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el, { offset: NAV_OFFSET, duration: 1.4 });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
