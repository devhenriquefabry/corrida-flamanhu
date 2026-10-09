import React, { createContext, useContext, useState, useCallback } from 'react';

interface LoadingContextType {
  showLoading: (duration: number, text: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({ 
  showLoading: () => {}, 
  hideLoading: () => {} 
});
export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');

  const hideLoading = useCallback(() => setLoading(false), []);

  const showLoading = useCallback((duration: number, t: string) => {
    setText(t || 'Carregando...');
    setLoading(true);
    if (duration > 0) {
      setTimeout(() => setLoading(false), duration);
    }
  }, []);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      {loading && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(22, 18, 19,.95)', zIndex: 99999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20
        }}>
          <div style={{ width: 50, height: 50, border: '4px solid rgba(224, 27, 34,.2)', borderTop: '4px solid #e01b22', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span style={{ color: '#ff2e38', fontWeight: 700, fontSize: '1.1rem', fontFamily: "'Barlow Condensed', sans-serif" }}>{text}</span>
        </div>
      )}
    </LoadingContext.Provider>
  );
}
