let estado = ESTADO.MENU;
let ui, stats;
let menuPrincipal, menuNiveis;
let labirinto, jogador, imgJogador;
let nivelAtual = 0;
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

// Cada botão de nível mostra o melhor resultado guardado
function atualizarMenuNiveis() {
  const opcoes = NIVEIS.map((n, i) => {
    const m = stats.melhor(i);
    return n.nome + '   ·   ' + (m ? 'melhor ' + m.residuos + '/' + m.total + ' · ' + formatarTempo(m.tempo) : 'sem resultado');
  });
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
        if (menuNiveis.selecionada < TOTAL_NIVEIS) iniciarNivel(menuNiveis.selecionada);
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
      // TEMPORÁRIO: ENTER termina o nível com resíduos aleatórios, para testar
      // o ecrã de resultado e as estatísticas. Apagar quando houver resíduos a sério.
      if (keyCode === ENTER) terminarNivel(floor(random(0, 9)), 8);
      break;

    case ESTADO.RESULTADO:
      if (keyCode === ENTER || keyCode === ESCAPE) irPara(ESTADO.NIVEIS);
      break;
  }

  // Impede que as setas façam scroll da página
  if ([UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW].includes(keyCode)) return false;
}

// ---------- Jogo ----------

function iniciarNivel(nivel) {
  nivelAtual = nivel;
  labirinto = new Labirinto(nivel);
  jogador = new Jogador(INICIO_COL, INICIO_LIN, imgJogador);
  tempoInicio = millis();
  estado = ESTADO.EXECUCAO;
}

function executarJogo() {
  labirinto.desenhar();
  jogador.mover(labirinto);
  jogador.desenhar();
  ui.hud(nivelAtual, millis() - tempoInicio);
}

function terminarNivel(residuos, total) {
  const tempo = millis() - tempoInicio;
  const recorde = stats.registar(nivelAtual, residuos, total, tempo);
  ultimoResultado = { nivel: nivelAtual, residuos, total, tempo, recorde };
  estado = ESTADO.RESULTADO;
}