// Uma bolinha azul de lixo eletrónico
class Residuo {
  constructor(col, lin) {
    this.x = col * CELULA + CELULA / 2;
    this.y = lin * CELULA + CELULA / 2;
    this.raio = 7;
    this.recolhido = false;
  }

  // Colisão círculo–círculo com a personagem
  tocadoPor(jogador) {
    return !this.recolhido && dist(this.x, this.y, jogador.x, jogador.y) < this.raio + jogador.raio;
  }

  desenhar() {
    if (this.recolhido) return;
    push();
    noStroke();
    fill(...COR.residuo);
    circle(this.x, this.y, this.raio * 2);
    pop();
  }
}