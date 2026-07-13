// GitHub Pages serves this project from /corrida-flamanhu/, not the domain
// root, so hardcoded asset paths (img src, icons) need this prefix. next/link
// and next/image would get it automatically via next.config.mjs' basePath,
// but plain <img src="/..."> tags do not — this constant keeps both in sync.
export const BASE_PATH =
  process.env.NODE_ENV === "production" ? "/corrida-flamanhu" : "";
