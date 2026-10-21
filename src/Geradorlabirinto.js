// Gera um labirinto novo, no mesmo formato dos níveis fixos (lista de textos).
// '#' = parede, '.' = corredor. As dimensões têm de ser ímpares.
// atalhos (0 a 1) = fração de paredes extra a derrubar; quanto maior, mais caminhos alternativos.
function gerarLabirinto(colunas, linhas, atalhos) {
  // 1. Começa com tudo parede
  const grelha = [];
  for (let lin = 0; lin < linhas; lin++) {
    grelha.push(new Array(colunas).fill('#'));
  }

  // 2. Escava corredores a partir da célula (1,1), saltando de 2 em 2 células.
  //    Anda sempre para uma célula vizinha ainda por escavar; quando não há nenhuma,
  //    recua pela pilha (algoritmo "depth-first").
  const pilha = [[1, 1]];
  grelha[1][1] = '.';
  while (pilha.length > 0) {
    const [x, y] = pilha[pilha.length - 1];

    const vizinhos = [];
    for (const [dx, dy] of [[2, 0], [-2, 0], [0, 2], [0, -2]]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx > 0 && nx < colunas - 1 && ny > 0 && ny < linhas - 1 && grelha[ny][nx] === '#') {
        vizinhos.push([nx, ny, dx, dy]);
      }
    }

    if (vizinhos.length === 0) {
      pilha.pop(); // beco sem saída: recua
      continue;
    }

    const [nx, ny, dx, dy] = random(vizinhos); // escolha ao acaso: é aqui que o mapa varia
    grelha[y + dy / 2][x + dx / 2] = '.';       // derruba a parede entre as duas células
    grelha[ny][nx] = '.';
    pilha.push([nx, ny]);
  }

  // 3. Derruba algumas paredes extra para criar atalhos (senão só haveria um caminho)
  const paredes = [];
  for (let lin = 1; lin < linhas - 1; lin++) {
    for (let col = 1; col < colunas - 1; col++) {
      const entreCelulas = (col % 2 === 1 && lin % 2 === 0) || (col % 2 === 0 && lin % 2 === 1);
      if (grelha[lin][col] === '#' && entreCelulas) paredes.push([col, lin]);
    }
  }
  const baralhadas = shuffle(paredes);
  const quantas = floor(baralhadas.length * atalhos);
  for (let i = 0; i < quantas; i++) {
    const [col, lin] = baralhadas[i];
    grelha[lin][col] = '.';
  }

  return grelha.map(linha => linha.join(''));
}