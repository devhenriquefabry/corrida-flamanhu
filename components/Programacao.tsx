import { MapPin, Navigation } from "lucide-react";
import { EVENTO } from "@/lib/evento";

// Horários do site (previstos, conforme o regulamento). Largada: 09h.
const ETAPAS = [
  { hora: "07h30", titulo: "Abertura da arena", texto: "Concentração, guarda-volumes e aquecimento com a Nação." },
  { hora: "09h00", titulo: "Largada oficial", texto: "Corrida 5K e caminhada 3K saem juntas.", destaque: true },
  { hora: "11h00", titulo: "Medalhas e premiação", texto: "Entrega de medalhas, troféus e prêmios em dinheiro no Estádio JK." },
  { hora: "11h30", titulo: "Atrações ao vivo", texto: "Shows e festa da torcida. A programação sai em breve nas redes sociais." },
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
              <small>
                Largada, chegada e entrega de medalhas no estádio.
                {EVENTO.localAConfirmar && " Local em confirmação; qualquer mudança é avisada aos inscritos."}
              </small>
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
