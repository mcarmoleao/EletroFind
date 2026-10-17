// Guarda e lê o melhor resultado de cada nível, localmente no browser
class Estatisticas {
  constructor() {
    this.chave = 'eletrofind_estatisticas';
    this.dados = this.carregar();
  }

  carregar() {
    try {
      return JSON.parse(localStorage.getItem(this.chave)) || {};
    } catch (e) {
      return {};
    }
  }

  guardar() {
    try {
      localStorage.setItem(this.chave, JSON.stringify(this.dados));
    } catch (e) { /* sem armazenamento: o jogo continua a funcionar */ }
  }

  melhor(nivel) {
    return this.dados[nivel] || null;
  }

  // Mais resíduos é melhor; com os mesmos resíduos, ganha o menor tempo.
  // Devolve true se for um novo recorde.
  registar(nivel, residuos, total, tempo) {
    const atual = this.dados[nivel];
    const melhor = !atual || residuos > atual.residuos ||
                   (residuos === atual.residuos && tempo < atual.tempo);
    if (melhor) {
      this.dados[nivel] = { residuos, total, tempo };
      this.guardar();
    }
    return melhor;
  }
}