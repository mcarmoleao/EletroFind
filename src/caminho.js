function encontrarCaminho(labirinto, inicio, fim) {
	const colunas = labirinto.colunas;
	const total = colunas * labirinto.linhas;
	const indiceInicio = inicio.lin * colunas + inicio.col;
	const indiceFim = fim.lin * colunas + fim.col;

	if (labirinto.ehParede(inicio.col, inicio.lin) || labirinto.ehParede(fim.col, fim.lin)) return null;

	const anterior = new Int32Array(total);
	anterior.fill(-1);
	const fila = new Int32Array(total);
	let cabeca = 0;
	let cauda = 0;
	fila[cauda++] = indiceInicio;
	anterior[indiceInicio] = indiceInicio;

	const direcoes = [[1, 0], [-1, 0], [0, 1], [0, -1]];
	while (cabeca < cauda && anterior[indiceFim] === -1) {
		const atual = fila[cabeca++];
		const col = atual % colunas;
		const lin = floor(atual / colunas);

		for (const [dc, dl] of direcoes) {
			const novaCol = col + dc;
			const novaLin = lin + dl;
			if (labirinto.ehParede(novaCol, novaLin)) continue;

			const novoIndice = novaLin * colunas + novaCol;
			if (anterior[novoIndice] !== -1) continue;
			anterior[novoIndice] = atual;
			fila[cauda++] = novoIndice;
		}
	}

	if (anterior[indiceFim] === -1) return null;

	const caminho = [];
	for (let indice = indiceFim; indice !== indiceInicio; indice = anterior[indice]) {
		caminho.push({ col: indice % colunas, lin: floor(indice / colunas) });
	}
	caminho.push({ col: inicio.col, lin: inicio.lin });
	caminho.reverse();
	return caminho;
}
