import "../globals.css";

// O CSS da landing fica restrito a este grupo para não vazar no sistema de
// inscrições (que traz o próprio App.css) e vice-versa.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
