import { ArrowRight } from "lucide-react";
import { EVENTO } from "@/lib/evento";

// Dados conforme o regulamento (itens 1.5, 4.1, 5.1 a 5.6 e 8).
const PROVAS = [
  {
    id: "5k",
    numero: "5",
    unidade: "K",
    tag: "Corrida cronometrada",
    texto: "Rápida e direta. Boa para estrear ou buscar o recorde pessoal.",
    dados: [
      ["Idade mínima", "14 anos"],
      ["Largada", `${EVENTO.largada}`],
      ["Premiação", "Dinheiro e troféu"],
    ],
  },
  {
    id: "10k",
    numero: "10",
    unidade: "K",
    tag: "Corrida cronometrada",
    texto: "O desafio completo pelas ruas de Manhuaçu, com a energia da torcida em cada quilômetro.",
    destaque: true,
    dados: [
      ["Idade mínima", "16 anos"],
      ["Largada", `${EVENTO.largada}`],
      ["Premiação", "Dinheiro e troféu"],
    ],
  },
  {
    id: "caminhada",
    numero: "3",
    unidade: "km",
    tag: "Caminhada participativa",
    texto: "Sem pressa e sem classificação. Venha em família vestir o manto e curtir a festa.",
    dados: [
      ["Idade mínima", "Livre*"],
      ["Largada", `${EVENTO.largada}`],
      ["Medalha", "Para quem completar"],
    ],
    rodape: "*Menores de 14 anos com responsável.",
  },
  {
    id: "kids",
    numero: "Kids",
    unidade: "",
    tag: "Corrida participativa",
    texto: "A garotada corre de 100 m a 500 m, conforme a idade, e todo mundo ganha medalha.",
    dados: [
      ["Idade", "4 a 14 anos"],
      ["Largada", "Horário em breve"],
      ["Medalha", "Para todos"],
    ],
  },
];

export default function Provas() {
  return (
    <section className="sec sec--light" id="provas">
      <div className="wrap">
        <header className="sec__head" data-reveal>
          <p className="eyebrow">Provas</p>
          <h2 className="h2">Escolha sua prova</h2>
          <p className="sec__lead">
            Quatro formas de participar no mesmo dia, todas na {EVENTO.local}. A largada de 5K, 10K e caminhada é às{" "}
            {EVENTO.largada}.
          </p>
        </header>

        <div className="provas">
          {PROVAS.map((p, i) => (
            <article
              key={p.id}
              className={`prova${p.destaque ? " prova--destaque" : ""}`}
              data-reveal
              style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
            >
              <p className="prova__tag">{p.tag}</p>
              <p className="prova__num" aria-label={`${p.numero}${p.unidade ? ` ${p.unidade}` : ""}`}>
                <span aria-hidden="true">
                  {p.numero}
                  {p.unidade && <small>{p.unidade}</small>}
                </span>
              </p>
              <p className="prova__texto">{p.texto}</p>
              <dl className="prova__dados">
                {p.dados.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              {p.rodape && <p className="prova__rodape">{p.rodape}</p>}
            </article>
          ))}
        </div>

        <p className="sec__nota" data-reveal>
          O mapa do percurso será publicado aqui e no Instagram antes da prova.{" "}
          <a href={EVENTO.regulamentoUrl}>
            Ler o regulamento <ArrowRight size={14} aria-hidden="true" />
          </a>
        </p>
      </div>
    </section>
  );
}
