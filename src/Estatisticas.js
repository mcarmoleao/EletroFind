// Guarda e lê o melhor tempo de cada nível, localmente no browser
class Estatisticas {
  constructor() {
    this.chave = 'eletrofind_estatisticas_v3';
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

  // Devolve true se o tempo for um novo recorde
  registar(nivel, tempo) {
    const atual = this.dados[nivel];
    if (!atual || tempo < atual.tempo) {
      this.dados[nivel] = { tempo };
      this.guardar();
      return true;
    }
    return false;
  }
}