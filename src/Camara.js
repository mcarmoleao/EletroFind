// Decide que parte do labirinto aparece no ecrã: segue a personagem
class Camara {
  constructor() {
    this.x = 0; // canto superior esquerdo da zona visível, em coordenadas do mapa
    this.y = 0;
  }

  // Centra a câmara no alvo, sem nunca mostrar nada fora do mapa
  seguir(alvo, larguraMapa, alturaMapa, instantaneo = false) {
    const alvoX = constrain(alvo.x - LARGURA / 2, 0, max(0, larguraMapa - LARGURA));
    const alvoY = constrain(alvo.y - VISTA_ALTURA / 2, 0, max(0, alturaMapa - VISTA_ALTURA));
    this.x = instantaneo ? alvoX : lerp(this.x, alvoX, 0.12); // lerp = movimento suave
    this.y = instantaneo ? alvoY : lerp(this.y, alvoY, 0.12);
  }

  // A partir daqui, tudo o que se desenha usa coordenadas do mapa.
  // O arredondamento evita linhas finas entre as células.
  aplicar() {
    translate(-round(this.x), MARGEM_TOPO - round(this.y));
  }
}