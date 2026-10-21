let estado = ESTADO.MENU;
let ui, stats;
let menuPrincipal, menuNiveis;
let labirinto, jogador, contentor, camara, imgJogador;
let residuos = [];
let carregados = 0; // resíduos apanhados e ainda não entregues
let entregues = 0;  // resíduos já no contentor
let nivelAtual = 0;
let definicao = null;   // o nível a decorrer: { nome, mapa, residuos }
let modoDesafio = false; // true no Desafio aleatório (não guarda tempos)
let tempoInicio = 0;
let ultimoResultado = null;

function setup() {
  createCanvas(LARGURA, ALTURA);
  ui = new Interface();
  stats = new Estatisticas();
  menuPrincipal = new Menu(['Jogar', 'Como jogar', 'Estatísticas']);
  menuNiveis = new Menu([], 480);

  // Imagem da personagem. Sem preload de propósito: se o ficheiro faltar,
  // o preload deixa o p5 à espera para sempre e a página fica em branco.
  imgJogador = loadImage('assets/images/jogador.png', () => {}, () => { imgJogador = null; });
}

function draw() {
  ui.fundo();

  switch (estado) {
    case ESTADO.MENU:         ui.menuPrincipal(menuPrincipal); break;
    case ESTADO.NIVEIS:       ui.selecaoNivel(menuNiveis);     break;
    case ESTADO.COMO_JOGAR:   ui.comoJogar();                  break;
    case ESTADO.ESTATISTICAS: ui.estatisticas(stats);          break;
    case ESTADO.EXECUCAO:     executarJogo();                  break;
    case ESTADO.RESULTADO:    ui.resultado(ultimoResultado);   break;
  }

  ui.rodape();
}

// ---------- Navegação entre ecrãs ----------

function irPara(novoEstado) {
  estado = novoEstado;
  if (novoEstado === ESTADO.NIVEIS) atualizarMenuNiveis();
}

// Os níveis mostram o melhor tempo guardado; depois vêm o desafio aleatório e o botão Voltar
function atualizarMenuNiveis() {
  const opcoes = NIVEIS.map((n, i) => {
    const m = stats.melhor(i);
    return n.nome + '   ·   ' + (m ? 'melhor ' + formatarTempo(m.tempo) : 'sem resultado');
  });
  opcoes.push('Desafio aleatório   ·   mapa novo de cada vez');
  opcoes.push('Voltar');
  menuNiveis.opcoes = opcoes;
}

// Move a seleção com as setas; devolve true quando se carrega em ENTER
function navegar(menu) {
  if (keyCode === UP_ARROW) menu.mover(-1);
  if (keyCode === DOWN_ARROW) menu.mover(1);
  return keyCode === ENTER;
}

function keyPressed() {
  userStartAudio(); // o browser só liberta o áudio após uma ação do utilizador

  switch (estado) {
    case ESTADO.MENU:
      if (navegar(menuPrincipal)) {
        const destinos = [ESTADO.NIVEIS, ESTADO.COMO_JOGAR, ESTADO.ESTATISTICAS];
        irPara(destinos[menuPrincipal.selecionada]);
      }
      break;

    case ESTADO.NIVEIS:
      if (navegar(menuNiveis)) {
        const escolha = menuNiveis.selecionada;
        if (escolha < TOTAL_NIVEIS) iniciarNivel(escolha);
        else if (escolha === TOTAL_NIVEIS) iniciarDesafio();
        else irPara(ESTADO.MENU);
      }
      if (keyCode === ESCAPE) irPara(ESTADO.MENU);
      break;

    case ESTADO.COMO_JOGAR:
    case ESTADO.ESTATISTICAS:
      if (keyCode === ESCAPE) irPara(ESTADO.MENU);
      break;

    case ESTADO.EXECUCAO:
      if (keyCode === ESCAPE) irPara(ESTADO.NIVEIS);
      break;

    case ESTADO.RESULTADO:
      if (keyCode === ENTER || keyCode === ESCAPE) irPara(ESTADO.NIVEIS);
      break;
  }

  // Impede que as setas façam scroll da página
  if ([UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW].includes(keyCode)) return false;
}

// ---------- Jogo ----------

// Nível fixo: o mapa e os resíduos vêm do niveis.js, iguais em todas as partidas
function iniciarNivel(nivel) {
  nivelAtual = nivel;
  iniciarJogo(NIVEIS[nivel], false);
}

// Desafio aleatório: mapa e resíduos novos de cada vez
function iniciarDesafio() {
  const colunas = 2 * floor(random(15, 23)) + 1; // ímpar, entre 31 e 45
  const linhas = 2 * floor(random(10, 14)) + 1;  // ímpar, entre 21 e 27
  iniciarJogo({ nome: 'Desafio aleatório', mapa: gerarLabirinto(colunas, linhas, 0.06) }, true);
}

function iniciarJogo(def, desafio) {
  definicao = def;
  modoDesafio = desafio;
  labirinto = new Labirinto(def);
  jogador = new Jogador(labirinto.inicio.col, labirinto.inicio.lin, imgJogador);
  contentor = new Contentor(labirinto.fim.col, labirinto.fim.lin);

  // Níveis fixos têm os resíduos definidos; no desafio sorteiam-se
  const posicoes = def.residuos || labirinto.posicoesResiduos(floor(random(8, 13)));
  residuos = posicoes.map(p => new Residuo(p.col, p.lin));

  carregados = 0;
  entregues = 0;
  camara = new Camara();
  camara.seguir(jogador, labirinto.largura, labirinto.altura, true); // começa já centrada
  tempoInicio = millis();
  estado = ESTADO.EXECUCAO;
}

function executarJogo() {
  jogador.mover(labirinto);
  atualizarResiduos();
  camara.seguir(jogador, labirinto.largura, labirinto.altura);

  desenharMundo();
  ui.hud(definicao.nome, millis() - tempoInicio, entregues, residuos.length, carregados);
}

// Recolha e entrega: tocar num resíduo apanha-o, tocar no contentor entrega o que se leva
function atualizarResiduos() {
  for (const r of residuos) {
    if (r.tocadoPor(jogador)) {
      r.recolhido = true;
      carregados++;
    }
  }

  if (carregados > 0 && contentor.tocadoPor(jogador)) {
    entregues += carregados;
    carregados = 0;
  }

  if (residuos.length > 0 && entregues === residuos.length) terminarNivel();
}

// Desenha o mapa deslocado pela câmara, cortado à janela de jogo
function desenharMundo() {
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(0, MARGEM_TOPO, LARGURA, VISTA_ALTURA);
  drawingContext.clip(); // nada do mapa aparece por cima do HUD e do rodapé

  camara.aplicar();
  labirinto.desenhar(camara);
  contentor.desenhar();
  for (const r of residuos) r.desenhar();
  jogador.desenhar();

  drawingContext.restore();
  pop();
}

function terminarNivel() {
  const tempo = millis() - tempoInicio;
  // O desafio aleatório não guarda tempos: cada mapa é diferente, não são comparáveis
  const recorde = modoDesafio ? false : stats.registar(nivelAtual, tempo, residuos.length);
  ultimoResultado = { nome: definicao.nome, total: residuos.length, tempo, recorde };
  estado = ESTADO.RESULTADO;
}