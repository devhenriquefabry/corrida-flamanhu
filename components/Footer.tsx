import { Mail, MapPin, Phone } from "lucide-react";
import { BASE_PATH } from "@/lib/base-path";
import { EVENTO } from "@/lib/evento";

export default function Footer() {
  return (
    <footer className="footer" id="contato">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <img src={`${BASE_PATH}/assets/logo-flamanhu-sm.webp`} alt="" width={64} height={64} loading="lazy" />
          <div>
            <strong>Corrida Flamanhu 2027</strong>
            <p>A Nação Rubro-Negra corre unida em Manhuaçu e região.</p>
            <p className="footer__hashtag">#CorridaFLAMANHU2027</p>
          </div>
        </div>

        <div>
          <h3 className="footer__titulo">Contato</h3>
          <ul className="footer__lista">
            <li>
              <a href={EVENTO.instagramUrl} target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <path d="M17.5 6.5h.01" />
                </svg>
                {EVENTO.instagramUser}
              </a>
            </li>
            <li>
              <a href={`mailto:${EVENTO.email}`}>
                <Mail size={18} aria-hidden="true" />
                {EVENTO.email}
              </a>
            </li>
            <li>
              <a href="https://wa.me/5533984500707" target="_blank" rel="noopener noreferrer">
                <Phone size={18} aria-hidden="true" />
                (33) 98450-0707
              </a>
            </li>
            <li>
              <a href={EVENTO.mapsUrl} target="_blank" rel="noopener noreferrer">
                <MapPin size={18} aria-hidden="true" />
                {EVENTO.local}, {EVENTO.bairro}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="footer__titulo">Organização</h3>
          <img
            className="footer__hennder"
            src={`${BASE_PATH}/assets/hennder-company-dark.svg`}
            alt="Hennder Company"
            width={190}
            height={32}
          />
          <p className="footer__parceria">Em parceria com a FlaManhu, torcida do Flamengo em Manhuaçu.</p>
          <a className="footer__reg" href={EVENTO.regulamentoUrl}>
            Regulamento oficial
          </a>
        </div>
      </div>

      <div className="footer__bar">
        <div className="wrap">
          <p>© 2026 Corrida FLAMANHU · Organização Hennder Company. Todos os direitos reservados.</p>
          <p>Este evento não tem vínculo com o Clube de Regatas do Flamengo.</p>
        </div>
      </div>
    </footer>
  );
}
