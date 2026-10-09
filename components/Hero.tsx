import { ArrowRight } from "lucide-react";
import { BASE_PATH } from "@/lib/base-path";
import { EVENTO } from "@/lib/evento";
import Countdown from "./Countdown";
import InscricaoStatus from "./InscricaoStatus";

const DADOS = [
  { rotulo: "Data", valor: EVENTO.dataCurta, nota: `${EVENTO.diaSemana}, ${EVENTO.dataLonga}` },
  { rotulo: "Largada", valor: EVENTO.largada, nota: `Concentração às ${EVENTO.concentracao}` },
  { rotulo: "Local", valor: EVENTO.local, nota: EVENTO.bairro, texto: true },
  { rotulo: "Provas", valor: "5K · 10K · 3K", nota: "Corrida, caminhada e Kids" },
];

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__bg" aria-hidden="true" />

      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="hero__meta">
            <span className="chip">{EVENTO.dataLonga} · 9h</span>
            <InscricaoStatus />
          </p>

          <h1 className="hero__title">
            <span className="hero__brand">Corrida Flamanhu 2027</span>
            <span className="hero__headline">
              A Nação
              <br />
              corre em
              <br />
              <em>Manhuaçu</em>
            </span>
          </h1>

          <p className="hero__lead">
            5K, 10K e caminhada pelas ruas da cidade, organizada por torcedores e aberta a todo mundo.
          </p>

          <div className="hero__cta">
            <a className="btn btn--primary btn--lg" href={EVENTO.inscricaoUrl}>
              Quero me inscrever
              <ArrowRight size={20} aria-hidden="true" />
            </a>
            <a className="btn btn--ghost btn--lg" href="#provas">
              Ver as provas
            </a>
          </div>
        </div>

        <div className="hero__art">
          <img
            src={`${BASE_PATH}/assets/logo-corrida-flamanhu.webp`}
            alt="Logo da Corrida Flamanhu 2027: corredor com a bandeira rubro-negra sobre a cidade de Manhuaçu"
            width={800}
            height={731}
            fetchPriority="high"
          />
        </div>

        <div className="hero__count">
          <Countdown />
        </div>
      </div>

      {/* faixa em formato de número de peito, com os dados que decidem a inscrição */}
      <div className="wrap hero__ticket-wrap">
        <dl className="ticket" aria-label="Dados da corrida">
          {DADOS.map((d) => (
            <div className="ticket__cell" key={d.rotulo}>
              <dt>{d.rotulo}</dt>
              <dd className={d.texto ? "is-text" : undefined}>{d.valor}</dd>
              <small>{d.nota}</small>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
