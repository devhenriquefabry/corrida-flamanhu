import React from 'react';
import { LOGO_CORRIDA, LOGO_CORRIDA_ALT } from '../config/marca';

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

export default function LoadingModal({ isOpen, message = 'Processando sua inscrição...' }: LoadingModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(20, 17, 18,0.95)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 15000,
      backdropFilter: 'blur(10px)',
      color: '#fff',
      textAlign: 'center',
      padding: 20
    }}>
      <div style={{ position: 'relative', marginBottom: 30 }}>
        {/* Speed lines animation */}
        <div className="speed-line" style={{ top: '20%', left: '-100px', animationDelay: '0s' }} />
        <div className="speed-line" style={{ top: '50%', left: '-150px', animationDelay: '0.2s' }} />
        <div className="speed-line" style={{ top: '80%', left: '-120px', animationDelay: '0.4s' }} />
        
        <img 
          src={LOGO_CORRIDA} 
          alt={LOGO_CORRIDA_ALT} 
          style={{ 
            width: 180, 
            animation: 'pulse-fast 0.8s infinite ease-in-out',
            filter: 'drop-shadow(0 0 20px rgba(224, 27, 34,0.5))'
          }} 
        />
        
        <div className="speed-line" style={{ top: '30%', right: '-100px', animationDelay: '0.1s' }} />
        <div className="speed-line" style={{ top: '60%', right: '-150px', animationDelay: '0.3s' }} />
      </div>

      <h2 style={{ 
        fontFamily: "'Barlow Condensed', sans-serif", 
        fontWeight: 900, 
        fontSize: '1.5rem', 
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: '#ff2e38'
      }}>
        {message}
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
        Aguarde um instante, estamos preparando tudo...
      </p>

      <style>{`
        @keyframes pulse-fast {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .speed-line {
          position: absolute;
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, transparent, #e01b22);
          border-radius: 3px;
          animation: speed-move 0.6s infinite linear;
          opacity: 0.6;
        }
        @keyframes speed-move {
          0% { transform: translateX(0) scaleX(0); opacity: 0; }
          50% { transform: translateX(100px) scaleX(1); opacity: 0.6; }
          100% { transform: translateX(200px) scaleX(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
