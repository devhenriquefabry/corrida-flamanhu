import { BASE_PATH } from '@/lib/base-path';

// Se o site for publicado fora da raiz do domínio (BASE_PATH), o React Router
// cuida das rotas (basename), mas caminhos crus — <img src>, fetch() de arquivos
// em public/ e window.location — precisam do prefixo na mão.
export const withBase = (path: string) => `${BASE_PATH}${path}`;
