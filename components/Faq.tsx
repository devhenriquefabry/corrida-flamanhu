import { ArrowRight } from "lucide-react";
import { EVENTO } from "@/lib/evento";

// Respostas conforme o regulamento (itens 1, 3.4, 4, 5, 6 e 7).
const PERGUNTAS = [
  {
    p: "Preciso ser torcedor do Flamengo para participar?",
    r: "Não. A corrida é aberta a todos, torcedores ou não. Quem participa só precisa respeitar o regulamento e as regras de convivência.",
  },
  {
    p: "Qual a idade mínima?",
    r: "No 5K, 14 anos; no 10K, 16 anos. A caminhada não tem idade mínima, mas menores de 14 anos precisam de um responsável. Na Kids, de 4 a 14 anos. A idade conta até 31/12/2027.",
  },
  {
    p: "Quanto tempo tenho para completar a prova?",
    r: "Duas horas, em todos os percursos. Quem chegar atrasado à largada pode sair em até 10 minutos, com o tempo contado desde a largada oficial.",
  },
  {
    p: "Posso retirar o kit no dia da corrida?",
    r: "Não. A retirada é antes da prova, com documento com foto e comprovante de inscrição. Se outra pessoa for buscar, ela leva autorização assinada e cópia do seu documento. Datas e local saem no Instagram.",
  },
  {
    p: "Posso desistir e pedir o dinheiro de volta?",
    r: "Sim, em até 7 dias depois da inscrição, como prevê o Código de Defesa do Consumidor. Depois desse prazo não há devolução. A inscrição é pessoal e não pode ser repassada.",
  },
  {
    p: "Quem organiza a corrida?",
    r: "A Hennder Company organiza o evento, em parceria com a FlaManhu, torcida do Flamengo em Manhuaçu. A corrida é independente e não tem vínculo com o Clube de Regatas do Flamengo.",
  },
];

export default function Faq() {
  return (
    <section className="sec sec--claro" id="duvidas">
      <div className="wrap faq">
        <header className="sec__head faq__head" data-reveal>
          <p className="eyebrow">Dúvidas</p>
          <h2 className="h2">Perguntas frequentes</h2>
          <p className="sec__lead">Não achou o que procurava? Escreva para {EVENTO.email} ou chame no Instagram.</p>
          <a className="link-seta" href={EVENTO.regulamentoUrl}>
            Ler o regulamento completo <ArrowRight size={16} aria-hidden="true" />
          </a>
        </header>

        <div className="faq__lista" data-reveal>
          {PERGUNTAS.map((q) => (
            <details key={q.p} name="faq">
              <summary>{q.p}</summary>
              <p>{q.r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
