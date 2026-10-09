import { Hash, Medal, Shirt, Timer } from "lucide-react";

// Kit: regulamento item 7.1. Prêmios: item 8 (5K e 10K, masculino e feminino).
const KIT = [
  { Icon: Shirt, titulo: "Camiseta oficial", texto: "Design exclusivo da Corrida Flamanhu 2027." },
  { Icon: Hash, titulo: "Número de peito", texto: "Para usar na frente da camiseta durante a prova." },
  { Icon: Timer, titulo: "Chip de cronometragem", texto: "Seu tempo oficial, sem depender de ninguém." },
  { Icon: Medal, titulo: "Medalha de finalizador", texto: "Entregue na chegada a quem completar a prova." },
];

const PODIO = [
  { lugar: 2, valor: "400" },
  { lugar: 1, valor: "500" },
  { lugar: 3, valor: "300" },
];

export default function KitPremios() {
  return (
    <section className="sec sec--cinza" id="premiacao">
      <div className="wrap">
        <header className="sec__head" data-reveal>
          <p className="eyebrow">Kit e prêmios</p>
          <h2 className="h2">O que você leva pra casa</h2>
        </header>

        <div className="duo">
          <article className="kit" data-reveal>
            <h3 className="h3">Kit e medalha</h3>
            <ul className="kit__lista">
              {KIT.map(({ Icon, titulo, texto }) => (
                <li key={titulo}>
                  <span className="kit__icone">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <div>
                    <strong>{titulo}</strong>
                    <p>{texto}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="kit__nota">Na Corrida Kids não há chip: a prova é só de participação.</p>
          </article>

          <article className="premios" data-reveal style={{ "--d": "90ms" } as React.CSSProperties}>
            <p className="premios__rotulo">Premiação em dinheiro</p>
            <p className="premios__total">
              <span>R$</span> 4.800
            </p>
            <p className="premios__sub">distribuídos entre os campeões do 5K e do 10K, masculino e feminino.</p>

            <ol className="podio" aria-label="Premiação por colocação, em cada categoria">
              {PODIO.map((p) => (
                <li key={p.lugar} className={`podio__bloco podio__bloco--${p.lugar}`}>
                  <span className="podio__valor">
                    <small>R$</small>
                    {p.valor}
                  </span>
                  <span className="podio__lugar">{p.lugar}º lugar</span>
                </li>
              ))}
            </ol>

            <ul className="premios__outros">
              <li>
                <strong>4º e 5º lugares:</strong> troféu e brinde
              </li>
              <li>
                <strong>Faixa etária:</strong> troféu do 1º ao 3º, de 14 a 70+ anos
              </li>
              <li>
                <strong>PCD e equipes:</strong> troféu para os melhores
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
