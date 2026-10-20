import { withBase } from '../utils/withBase';

// Logo oficial da Corrida Flamanhu 2027, versão "adesivo" (recorte com contorno
// branco): o corredor e a silhueta da cidade continuam legíveis em fundo escuro
// e a peça funciona igual em fundo claro.
// .webp nas telas (≈100 KB); .png onde a biblioteca não lê webp (jsPDF, ExcelJS).
// O ?v= muda a cada arte nova da logo: o Hosting guarda imagem por 1 dia no
// navegador, e sem isso quem já visitou continua vendo a versão anterior.
const LOGO_VERSAO = '5k';
export const LOGO_CORRIDA = withBase(`/sistema/logo-corrida-flamanhu.webp?v=${LOGO_VERSAO}`);
export const LOGO_CORRIDA_PNG = withBase(`/sistema/logo-corrida-flamanhu.png?v=${LOGO_VERSAO}`);
export const LOGO_CORRIDA_RATIO = 800 / 731; // largura / altura do arquivo
export const LOGO_CORRIDA_ALT = 'Corrida Flamanhu 2027';
