// Estados (ecrãs) do jogo
const ESTADO = {
  MENU: 'menu',
  NIVEIS: 'niveis',
  COMO_JOGAR: 'comoJogar',
  ESTATISTICAS: 'estatisticas',
  EXECUCAO: 'execucao',
  RESULTADO: 'resultado'
};

// Grelha do labirinto: 21 colunas x 13 linhas de 40 px
const COLUNAS = 21;
const LINHAS = 13;
const CELULA = 40;
const MARGEM_TOPO = 40; // espaço para o HUD; o rodapé usa a margem de baixo
const LARGURA = COLUNAS * CELULA;                 // 840
const ALTURA = LINHAS * CELULA + 2 * MARGEM_TOPO; // 600

// Início e fim de todos os níveis (coluna, linha)
const INICIO_COL = 1, INICIO_LIN = 1;
const FIM_COL = 19, FIM_LIN = 11;

// Paleta (arrays RGB, porque color() só existe depois de o p5 arrancar)
const COR = {
  fundo: [24, 48, 44],
  botao: [40, 84, 74],
  destaque: [255, 200, 60],
  texto: [240, 245, 240],
  suave: [160, 190, 180]
};

// Textos do rodapé obrigatório
const TEMA = 'Electronic Waste Collection';
const AUTOR = 'Maria do Carmo · N.º 00000 · ECGM'; // troca pelo teu número de aluno