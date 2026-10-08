import { BASE_PATH } from '@/lib/base-path';

// O site é publicado em /corrida-flamanhu/ no GitHub Pages. O React Router já
// cuida das rotas (basename), mas caminhos crus — <img src>, fetch() de arquivos
// em public/ e window.location — precisam do prefixo na mão.
export const withBase = (path: string) => `${BASE_PATH}${path}`;
