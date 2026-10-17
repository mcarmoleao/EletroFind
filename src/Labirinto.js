// O mapa de um nível: matriz de 0 e 1, desenho, colisões e colocação dos resíduos
class Labirinto {
  constructor(nivel) {
    // Converte o mapa do nível numa matriz: 1 = parede, 0 = corredor
    this.mapa = NIVEIS[nivel].mapa.map(linha => linha.split('').map(c => (c === '#' ? 1 : 0)));
    this.linhas = this.mapa.length;
    this.colunas = this.mapa[0].length;
    this.largura = this.colunas * CELULA;
    this.altura = this.linhas * CELULA;
    this.inicio = { col: 1, lin: 1 };
    this.fim = { col: this.colunas - 2, lin: this.linhas - 2 };
  }

  // Fora da grelha conta como parede, para ninguém sair do mapa
  ehParede(col, lin) {
    if (col < 0 || col >= this.colunas || lin < 0 || lin >= this.linhas) return true;
    return this.mapa[lin][col] === 1;
  }

  // Colisão círculo–retângulo: testa só as células à volta do círculo
  colideCirculo(x, y, raio) {
    const col0 = floor((x - raio) / CELULA);
    const col1 = floor((x + raio) / CELULA);
    const lin0 = floor((y - raio) / CELULA);
    const lin1 = floor((y + raio) / CELULA);

    for (let lin = lin0; lin <= lin1; lin++) {
      for (let col = col0; col <= col1; col++) {
        if (!this.ehParede(col, lin)) continue;
        const px = constrain(x, col * CELULA, (col + 1) * CELULA);
        const py = constrain(y, lin * CELULA, (lin + 1) * CELULA);
        if (dist(x, y, px, py) < raio) return true;
      }
    }
    return false;
  }

  // Distância em células, em passos retos (não conta as paredes)
  distancia(a, b) {
    return abs(a.col - b.col) + abs(a.lin - b.lin);
  }

  // Escolhe células livres ao acaso, afastadas entre si, do início e do contentor
  posicoesResiduos(quantidade) {
    const livres = [];
    for (let lin = 0; lin < this.linhas; lin++) {
      for (let col = 0; col < this.colunas; col++) {
        if (!this.ehParede(col, lin)) livres.push({ col, lin });
      }
    }

    const escolhidas = [];
    // Começa exigente (resíduos bem afastados) e relaxa se não houver espaço
    for (let distMin = 8; distMin >= 1 && escolhidas.length < quantidade; distMin--) {
      for (let t = 0; t < 300 && escolhidas.length < quantidade; t++) {
        const c = random(livres);
        if (this.distancia(c, this.inicio) >= 6 &&
            this.distancia(c, this.fim) >= 4 &&
            escolhidas.every(e => this.distancia(c, e) >= distMin)) {
          escolhidas.push(c);
        }
      }
    }
    return escolhidas;
  }

  // Só desenha as células que a câmara está a mostrar
  desenhar(camara) {
    const c0 = max(0, floor(camara.x / CELULA));
    const c1 = min(this.colunas - 1, floor((camara.x + LARGURA) / CELULA));
    const l0 = max(0, floor(camara.y / CELULA));
    const l1 = min(this.linhas - 1, floor((camara.y + VISTA_ALTURA) / CELULA));

    push();
    noStroke();
    for (let lin = l0; lin <= l1; lin++) {
      for (let col = c0; col <= c1; col++) {
        fill(...(this.mapa[lin][col] === 1 ? COR.parede : COR.chao));
        rect(col * CELULA, lin * CELULA, CELULA, CELULA);
      }
    }
    pop();
  }
}