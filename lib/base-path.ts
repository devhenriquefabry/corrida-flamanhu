// Prefixo do site quando ele não fica na raiz do domínio (ex.: GitHub Pages em
// /corrida-flamanhu/). No Firebase Hosting o site fica na raiz, então é vazio.
// next/link e next/image recebem o prefixo pelo basePath do next.config.mjs,
// mas <img src="/..."> cru não — esta constante mantém os dois iguais.
export const BASE_PATH = "";
