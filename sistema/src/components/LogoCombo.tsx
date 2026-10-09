import React from 'react';
import { LOGO_CORRIDA, LOGO_CORRIDA_ALT } from '../config/marca';

interface LogoComboProps {
  className?: string;
  style?: React.CSSProperties;
  /** Altura da logo em px. */
  height?: number;
}

// Selo da Corrida Flamanhu usado nos topos de página (sorteio, pagamento).
export const LogoCombo: React.FC<LogoComboProps> = ({ className, style, height = 84 }) => (
  <img
    src={LOGO_CORRIDA}
    alt={LOGO_CORRIDA_ALT}
    className={`logo-combo ${className || ''}`}
    style={{
      height,
      width: 'auto',
      objectFit: 'contain',
      filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.45))',
      ...style,
    }}
  />
);
