import { ArrowRight } from "lucide-react";
import { EVENTO } from "@/lib/evento";
import InscricaoStatus from "./InscricaoStatus";

// Passos conforme o regulamento (itens 6 e 7).
const PASSOS = [
  {
    titulo: "Escolha a prova",
    texto: "5K, 10K, caminhada ou Kids. Na inscrição você também escolhe o tamanho da camiseta.",
  },
  {
    titulo: "Pague e confirme",
    texto: "Pix ou cartão de crédito. A vaga só vale depois que o pagamento é aprovado.",
  },
  {
    titulo: "Retire o seu kit",
    texto: "Leve documento com foto e o comprovante. Não entregamos kit no dia da prova.",
  },
];

export default function ComoParticipar() {
  return (
    <section className="sec sec--rubro" id="como-participar">
      <div className="wrap">
        <header className="sec__head" data-reveal>
          <p className="eyebrow">Como participar</p>
          <h2 className="h2">Três passos até a largada</h2>
        </header>

        <ol className="passos">
          {PASSOS.map((p, i) => (
            <li key={p.titulo} className="passo" data-reveal style={{ "--d": `${i * 80}ms` } as React.CSSProperties}>
              <span className="passo__n" aria-hidden="true">
                {i + 1}
              </span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>

        <div className="descontos" data-reveal>
          <p>
            <strong>50% de desconto</strong> para pessoas com deficiência (PCD) e para quem tem 60 anos ou mais.
          </p>
          <p>
            Valores por lote, divulgados na abertura das inscrições. Cupons promocionais podem ser anunciados no
            Instagram.
          </p>
        </div>

        <div className="sec__acao" data-reveal>
          <InscricaoStatus className="status--sobre-rubro" />
          <a className="btn btn--branco btn--lg" href={EVENTO.inscricaoUrl}>
            Quero me inscrever
            <ArrowRight size={20} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
