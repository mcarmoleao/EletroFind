// A personagem: posição, movimento pelas setas e colisão com as paredes
class Jogador {
  constructor(col, lin, img) {
    this.img = img; // imagem da pasta assets (pode ser null)
    this.raio = 12;
    this.velocidade = 2.5;
    this.x = col * CELULA + CELULA / 2;
    this.y = lin * CELULA + CELULA / 2;
  }

  mover(labirinto) {
    let dx = 0;
    let dy = 0;
    if (keyIsDown(LEFT_ARROW)) dx -= 1;
    if (keyIsDown(RIGHT_ARROW)) dx += 1;
    if (keyIsDown(UP_ARROW)) dy -= 1;
    if (keyIsDown(DOWN_ARROW)) dy += 1;

    if (dx !== 0 && dy !== 0) { dx *= 0.7071; dy *= 0.7071; }

    this.x += dx * this.velocidade;
    if (labirinto.colideCirculo(this.x, this.y, this.raio)) this.x -= dx * this.velocidade;
    this.y += dy * this.velocidade;
    if (labirinto.colideCirculo(this.x, this.y, this.raio)) this.y -= dy * this.velocidade;
  }

  desenhar() {
    push();
    if (this.img && this.img.width > 1) {
      imageMode(CENTER);
      image(this.img, this.x, this.y, this.raio * 2.6, this.raio * 2.6);
    } else {
      noStroke();
      fill(...COR.destaque);
      circle(this.x, this.y, this.raio * 2);
    }
    pop();
  }
}