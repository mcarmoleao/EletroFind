// Guarda o mapa (matriz de 0 e 1), desenha as paredes e responde a colisões
class Labirinto {
    constructor(nivel) {
        // Converte o mapa do nível numa matriz: 1 = parede, 0 = corredor
        this.mapa = NIVEIS[nivel].mapa.map(linha => linha.split('').map(c => (c === '#' ? 1 : 0)));
    }

  // Fora da grelha conta como parede, para ninguém sair do mapa
  ehParede(col, lin) {
    if (col < 0 || col >= COLUNAS || lin < 0 || lin >= LINHAS) return true;
    return this.mapa[lin][col] === 1;
  }

  // Colisão círculo–retângulo: testa só as células à volta do círculo
  colideCirculo(x, y, raio) {
    const col0 = floor((x - raio) / CELULA);
    const col1 = floor((x + raio) / CELULA);
    const lin0 = floor((y - MARGEM_TOPO - raio) / CELULA);
    const lin1 = floor((y - MARGEM_TOPO + raio) / CELULA);

    for (let lin = lin0; lin <= lin1; lin++) {
      for (let col = col0; col <= col1; col++) {
        if (!this.ehParede(col, lin)) continue;

        // Ponto da célula mais próximo do centro do círculo
        const px = constrain(x, col * CELULA, (col + 1) * CELULA);
        const py = constrain(y, MARGEM_TOPO + lin * CELULA, MARGEM_TOPO + (lin + 1) * CELULA);

        // Se esse ponto está dentro do círculo, há colisão
        if (dist(x, y, px, py) < raio) return true;
      }
    }
    return false;
  }

  desenhar() {
    push();
    noStroke();
    for (let lin = 0; lin < LINHAS; lin++) {
      for (let col = 0; col < COLUNAS; col++) {
        fill(this.mapa[lin][col] === 1 ? color(60, 90, 80) : color(30, 45, 55));
        rect(col * CELULA, MARGEM_TOPO + lin * CELULA, CELULA, CELULA);
      }
    }
    pop();
  }
}