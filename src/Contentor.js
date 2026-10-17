// O retângulo onde se entregam os resíduos, no fim do labirinto
class Contentor {
  constructor(col, lin) {
    this.x = col * CELULA + CELULA / 2;
    this.y = lin * CELULA + CELULA / 2;
    this.largura = 32;
    this.altura = 26;
  }

  // Colisão círculo–retângulo: ponto do retângulo mais perto do centro da personagem
  tocadoPor(jogador) {
    const px = constrain(jogador.x, this.x - this.largura / 2, this.x + this.largura / 2);
    const py = constrain(jogador.y, this.y - this.altura / 2, this.y + this.altura / 2);
    return dist(jogador.x, jogador.y, px, py) < jogador.raio;
  }

  desenhar() {
    push();
    rectMode(CENTER);
    stroke(...COR.texto);
    strokeWeight(2);
    fill(...COR.contentor);
    rect(this.x, this.y, this.largura, this.altura, 4);
    pop();
  }
}