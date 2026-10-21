// Estados (ecrãs) do jogo
const ESTADO = {
  MENU: 'menu',
  NIVEIS: 'niveis',
  COMO_JOGAR: 'comoJogar',
  ESTATISTICAS: 'estatisticas',
  EXECUCAO: 'execucao',
  RESULTADO: 'resultado'
};

// Janela do jogo: canvas com uma faixa em cima (HUD) e outra em baixo (rodapé)
const CELULA = 40;
const LARGURA = 840;
const ALTURA = 600;
const MARGEM_TOPO = 40;
const MARGEM_BASE = 40;
const VISTA_ALTURA = ALTURA - MARGEM_TOPO - MARGEM_BASE; // zona onde se vê o labirinto

// Paleta (arrays RGB, porque color() só existe depois de o p5 arrancar)
const COR = {
  fundo: [24, 48, 44],
  botao: [40, 84, 74],
  destaque: [255, 200, 60],
  texto: [240, 245, 240],
  suave: [160, 190, 180],
  parede: [60, 90, 80],
  chao: [30, 45, 55],
  residuo: [70, 150, 255],
  contentor: [80, 200, 120]
};

// Textos do rodapé obrigatório
const TEMA = 'Electronic Waste Collection';
const AUTOR = 'Maria do Carmo · N.º 30382 · ECGM';