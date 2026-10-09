import { ArrowRight } from "lucide-react";
import { EVENTO } from "@/lib/evento";

export default function CtaFinal() {
  return (
    <section className="cta" id="inscreva-se">
      <div className="cta__hoops" aria-hidden="true" />
      <div className="wrap cta__inner" data-reveal>
        <p className="eyebrow eyebrow--vivo">
          {EVENTO.dataLonga} · Manhuaçu
        </p>
        <h2 className="cta__title">
          Vista o manto.
          <br />
          <em>Seja Flamanhu.</em>
        </h2>
        <div className="cta__acoes">
          <a className="btn btn--primary btn--lg" href={EVENTO.inscricaoUrl}>
            Quero me inscrever
            <ArrowRight size={20} aria-hidden="true" />
          </a>
          <a className="btn btn--ghost btn--lg" href={EVENTO.instagramUrl} target="_blank" rel="noopener noreferrer">
            Seguir {EVENTO.instagramUser}
          </a>
        </div>
      </div>
    </section>
  );
}
