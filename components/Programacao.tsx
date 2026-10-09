import { MapPin, Navigation } from "lucide-react";
import { EVENTO } from "@/lib/evento";

// Horários do site (previstos, conforme o regulamento). Largada: 09h.
const ETAPAS = [
  { hora: "07h30", titulo: "Abertura da arena", texto: "Concentração, guarda-volumes e aquecimento com a Nação." },
  { hora: "09h00", titulo: "Largada oficial", texto: "5K, 10K e caminhada saem juntos.", destaque: true },
  { hora: "11h00", titulo: "Cerimônia de premiação", texto: "Troféus e prêmios em dinheiro para os campeões." },
  { hora: "11h30", titulo: "Festa da torcida", texto: "Música e comemoração para fechar a manhã." },
];

export default function Programacao() {
  return (
    <section className="sec sec--dark" id="programacao">
      <div className="wrap prog">
        <header className="sec__head prog__head" data-reveal>
          <p className="eyebrow">Dia da prova</p>
          <h2 className="h2">
            {EVENTO.diaSemana[0].toUpperCase() + EVENTO.diaSemana.slice(1)},
            <br />
            <em>15 de maio</em>
          </h2>
          <p className="sec__lead">Horários previstos. Qualquer mudança é avisada com antecedência no Instagram.</p>

          <address className="local" data-reveal>
            <MapPin size={22} aria-hidden="true" />
            <div>
              <strong>{EVENTO.local}</strong>
              <span>{EVENTO.bairro}</span>
              <small>Largada e chegada no mesmo ponto.</small>
            </div>
            <a className="btn btn--ghost btn--sm" href={EVENTO.mapsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation size={16} aria-hidden="true" />
              Como chegar
            </a>
          </address>
        </header>

        <ol className="linha">
          {ETAPAS.map((e, i) => (
            <li
              key={e.hora}
              className={`linha__item${e.destaque ? " is-destaque" : ""}`}
              data-reveal
              style={{ "--d": `${i * 80}ms` } as React.CSSProperties}
            >
              <time className="linha__hora">{e.hora}</time>
              <div>
                <h3>{e.titulo}</h3>
                <p>{e.texto}</p>
              </div>
            </li>
          ))}
          <li className="linha__nota" data-reveal>
            A Corrida Kids tem horário próprio, divulgado em breve.
          </li>
        </ol>
      </div>
    </section>
  );
}
