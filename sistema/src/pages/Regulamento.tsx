import { ArrowLeft, Download, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { REGULAMENTO_OFICIAL, REGULAMENTO_PDF_URL } from '../content/regulamentoOficial';
import '../App.css';
import { LOGO_CORRIDA, LOGO_CORRIDA_ALT } from '../config/marca';
import { EVENTO } from '../config/evento';

export default function Regulamento() {
  const navigate = useNavigate();

  return (
    <div className="public-app-root regulation-page">
      <div className="regulation-shell">
        <header className="regulation-header">
          <button type="button" className="regulation-back" onClick={() => navigate('/')}>
            <ArrowLeft size={18} />
            Voltar
          </button>
          <div className="regulation-brand">
            <img src={LOGO_CORRIDA} alt={LOGO_CORRIDA_ALT} />
          </div>
          <a className="regulation-download" href={REGULAMENTO_PDF_URL} target="_blank" rel="noreferrer">
            <Download size={18} />
            PDF
          </a>
        </header>

        <main className="regulation-card">
          <div className="regulation-title">
            <span>
              <FileText size={20} />
              Regulamento oficial
            </span>
            <h1>Corrida Flamanhu 2027</h1>
            <p>Manhuaçu/MG • {EVENTO.data}</p>
            <div className="regulation-mobile-actions">
              <a href={REGULAMENTO_PDF_URL} target="_blank" rel="noreferrer">
                <Download size={18} />
                Abrir PDF oficial
              </a>
            </div>
          </div>

          <pre className="regulation-text">{REGULAMENTO_OFICIAL}</pre>
        </main>
      </div>
    </div>
  );
}
