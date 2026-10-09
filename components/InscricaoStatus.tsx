"use client";

import { useEffect, useState } from "react";
import { EVENTO } from "@/lib/evento";

// Lê, sem SDK, o mesmo documento que a tela /inscricao consulta
// (nightrun_settings/site_maintenance). Sem resposta ou com erro, assume
// "fechadas" — igual ao comportamento do sistema de inscrições.
type Estado = "carregando" | "abertas" | "fechadas";

let cache: Promise<Estado> | null = null;

function consultar(): Promise<Estado> {
  if (!cache) {
    const url = `https://firestore.googleapis.com/v1/projects/${EVENTO.firebaseProjectId}/databases/(default)/documents/nightrun_settings/site_maintenance`;
    cache = fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((doc): Estado => {
        const fechadas = doc?.fields?.registrationsClosed?.booleanValue;
        return fechadas === false ? "abertas" : "fechadas";
      })
      .catch((): Estado => "fechadas");
  }
  return cache;
}

export function useInscricaoStatus(): Estado {
  const [estado, setEstado] = useState<Estado>("carregando");
  useEffect(() => {
    let vivo = true;
    consultar().then((e) => vivo && setEstado(e));
    return () => {
      vivo = false;
    };
  }, []);
  return estado;
}

export default function InscricaoStatus({ className = "" }: { className?: string }) {
  const estado = useInscricaoStatus();
  const aberta = estado === "abertas";
  return (
    <span
      className={`status ${aberta ? "status--on" : "status--off"} ${estado === "carregando" ? "is-loading" : ""} ${className}`}
      role="status"
    >
      <span className="status__dot" aria-hidden="true" />
      {estado === "carregando" ? "Inscrições" : aberta ? "Inscrições abertas" : "Inscrições em breve"}
    </span>
  );
}
