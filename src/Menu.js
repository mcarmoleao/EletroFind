// Lista vertical de botões; só um está selecionado de cada vez
class Menu {
  constructor(opcoes, largura = 320) {
    this.opcoes = opcoes;
    this.largura = largura;
    this.altura = 44;
    this.espaco = 12;
    this.selecionada = 0;
  }

  // passo = -1 (cima) ou +1 (baixo); dá a volta no fim da lista
  mover(passo) {
    const n = this.opcoes.length;
    this.selecionada = (this.selecionada + passo + n) % n;
  }

  desenhar(yInicial) {
    push();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    textSize(20);
    noStroke();
    for (let i = 0; i < this.opcoes.length; i++) {
      const y = yInicial + i * (this.altura + this.espaco) + this.altura / 2;
      const ativa = i === this.selecionada;
      fill(...(ativa ? COR.destaque : COR.botao));
      rect(LARGURA / 2, y, this.largura, this.altura, 12);
      fill(...(ativa ? COR.fundo : COR.texto));
      text(this.opcoes[i], LARGURA / 2, y);
    }
    pop();
  }
}