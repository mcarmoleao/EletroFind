// Formata milissegundos como mm:ss
function formatarTempo(ms) {
  const s = floor(ms / 1000);
  return nf(floor(s / 60), 2) + ':' + nf(s % 60, 2);
}

// Desenha todos os ecrãs, o HUD e o rodapé
class Interface {
  fundo() {
    background(...COR.fundo);
  }

  titulo(texto, y, tamanho) {
    push();
    fill(...COR.destaque);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(tamanho);
    text(texto, LARGURA / 2, y);
    pop();
  }

  dica(texto) {
    push();
    fill(...COR.suave);
    textAlign(CENTER, CENTER);
    textSize(13);
    text(texto, LARGURA / 2, ALTURA - 50);
    pop();
  }

  menuPrincipal(menu) {
    this.titulo('EletroFind', 120, 64);
    push();
    fill(...COR.suave);
    textAlign(CENTER, CENTER);
    textSize(16);
    text('Recolha de resíduos eletrónicos', LARGURA / 2, 180);
    pop();
    menu.desenhar(250);
    this.dica('↑ ↓ para escolher   ·   ENTER para confirmar');
  }

  selecaoNivel(menu) {
    this.titulo('Escolher nível', 80, 40);
    menu.desenhar(140);
    this.dica('↑ ↓ para escolher   ·   ENTER para jogar   ·   ESC para voltar');
  }

  // Escreve um bloco (título + linhas) e devolve o y seguinte
  bloco(titulo, linhas, x, y) {
    push();
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(18);
    fill(...COR.destaque);
    text(titulo, x, y);
    textStyle(NORMAL);
    textSize(15);
    fill(...COR.texto);
    for (let i = 0; i < linhas.length; i++) {
      text('•  ' + linhas[i], x, y + 28 + i * 22);
    }
    pop();
    return y + 28 + linhas.length * 22 + 16;
  }

  comoJogar() {
    this.titulo('Como jogar', 60, 40);
    push();
    noStroke();
    fill(0, 0, 0, 70);
    rect(60, 105, LARGURA - 120, 370, 12);
    pop();

    let y = 125;
    y = this.bloco('OBJETIVO', [
      'Recolhe todos os resíduos azuis espalhados pelo labirinto.',
      'Leva-os ao contentor (retângulo verde), no fim do nível.',
      'O labirinto continua para lá do ecrã. O nível acaba quando entregares todos.'
    ], 90, y);
    y = this.bloco('CONTROLOS', [
      'Setas: mover a personagem.',
      'Grito no microfone: emite uma onda sonora.',
      'ENTER: confirmar   ·   ESC: voltar atrás.'
    ], 90, y);
    this.bloco('REGRAS', [
      'A onda revela, durante alguns segundos, o caminho até aos resíduos que atravessar.',
      'Depois de gritares, tens de esperar um tempo de recarga para voltar a usar a onda.',
      'O melhor resultado de cada nível fica guardado neste computador.'
    ], 90, y);
    this.dica('ESC para voltar');
  }

  estatisticas(stats) {
    this.titulo('Estatísticas', 60, 40);
    push();
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(16);
    fill(...COR.destaque);
    text('Nível', 220, 140);
    text('Melhor tempo', 500, 140);
    textStyle(NORMAL);
    textSize(20);
    for (let i = 0; i < TOTAL_NIVEIS; i++) {
      const y = 195 + i * 56;
      const m = stats.melhor(i);
      fill(...COR.texto);
      text(NIVEIS[i].nome, 220, y);
      text(m ? formatarTempo(m.tempo) : '—', 500, y);
      stroke(...COR.suave, 80);
      line(200, y + 28, LARGURA - 200, y + 28);
      noStroke();
    }
    pop();
    this.dica('Menor tempo de cada nível   ·   ESC para voltar');
  }


  // Barra no topo durante o jogo (fica fixa, não acompanha a câmara)
  hud(nivel, tempo, entregues, total, carregados) {
    push();
    textSize(16);
    textAlign(LEFT, CENTER);
    fill(...COR.texto);
    text(NIVEIS[nivel].nome + '  ·  ESC: sair', 16, MARGEM_TOPO / 2);
    textAlign(CENTER, CENTER);
    fill(...COR.residuo);
    text('Entregues ' + entregues + '/' + total + (carregados > 0 ? '  ·  a levar ' + carregados : ''),
         LARGURA / 2, MARGEM_TOPO / 2);
    textAlign(RIGHT, CENTER);
    fill(...COR.texto);
    text(formatarTempo(tempo) + ' min', LARGURA - 16, MARGEM_TOPO / 2);
    pop();
  }

  resultado(r) {
    this.titulo('Nível concluído', 150, 44);
    push();
    fill(...COR.texto);
    textAlign(CENTER, CENTER);
    textSize(22);
    text(NIVEIS[r.nivel].nome, LARGURA / 2, 230);
    text('Resíduos entregues: ' + r.total, LARGURA / 2, 275);
    text('Tempo: ' + formatarTempo(r.tempo), LARGURA / 2, 310);
    if (r.recorde) {
      fill(...COR.destaque);
      text('Novo recorde!', LARGURA / 2, 365);
    }
    pop();
    this.dica('ENTER para voltar aos níveis');
  }

  // Tema em baixo à esquerda, autor em baixo à direita
  rodape() {
    push();
    fill(...COR.suave);
    textSize(12);
    textAlign(LEFT, BOTTOM);
    text(TEMA, 16, ALTURA - 12);
    textAlign(RIGHT, BOTTOM);
    text(AUTOR, LARGURA - 16, ALTURA - 12);
    pop();
  }
}