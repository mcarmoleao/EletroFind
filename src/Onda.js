class Onda {
	constructor() {
		this.cooldown = 10000;
		this.velocidade = 420;
		this.resetar();
	}

	resetar() {
		this.ultimaEmissao = -Infinity;
		this.ativa = false;
		this.raio = 0;
		this.raioAnterior = 0;
		this.raioMaximo = 0;
		this.inicio = 0;
		this.x = 0;
		this.y = 0;
		this.alvo = null;
		this.rota = null;
		this.progressoRota = 0;
	}

	podeEmitir(agora) {
		return agora - this.ultimaEmissao >= this.cooldown;
	}

	emitir(jogador, labirinto, agora) {
		if (!this.podeEmitir(agora)) return false;

		this.ultimaEmissao = agora;
		this.inicio = agora;
		this.x = jogador.x;
		this.y = jogador.y;
		this.raio = 0;
		this.raioAnterior = 0;
		this.alvo = null;
		this.rota = null;
		this.ativa = true;

		const cantos = [
			[0, 0], [labirinto.largura, 0],
			[0, labirinto.altura], [labirinto.largura, labirinto.altura]
		];
		this.raioMaximo = Math.max(...cantos.map(([x, y]) => Math.hypot(x - this.x, y - this.y)));
		return true;
	}

	atualizar(agora, jogador, labirinto, residuos) {
		if (this.ativa) {
			this.raioAnterior = this.raio;
			this.raio = Math.min(this.raioMaximo, (agora - this.inicio) * this.velocidade / 1000);

			const inicio = {
				col: floor(this.x / CELULA),
				lin: floor(this.y / CELULA)
			};
			const atingidos = [];
			for (const residuo of residuos) {
				if (residuo.recolhido) continue;
				const distancia = Math.hypot(residuo.x - this.x, residuo.y - this.y);
				const raioImpacto = Math.max(0, distancia - residuo.raio);
				if (raioImpacto < this.raioAnterior - 0.001 || raioImpacto > this.raio + 0.001) continue;

				const fim = {
					col: floor(residuo.x / CELULA),
					lin: floor(residuo.y / CELULA)
				};
				const caminho = encontrarCaminho(labirinto, inicio, fim);
				if (caminho) atingidos.push({ residuo, caminho, distancia });
			}

			if (atingidos.length > 0) {
				atingidos.sort((a, b) => a.caminho.length - b.caminho.length || a.distancia - b.distancia);
				this.definirRota(atingidos[0].residuo, atingidos[0].caminho);
				this.ativa = false;
			} else if (this.raio >= this.raioMaximo) {
				this.ativa = false;
			}
		}

		this.atualizarRota(agora, jogador);
	}

	definirRota(residuo, caminho) {
		this.alvo = residuo;
		this.rota = [{ x: this.x, y: this.y }];
		for (const celula of caminho.slice(1)) {
			this.rota.push({
				x: celula.col * CELULA + CELULA / 2,
				y: celula.lin * CELULA + CELULA / 2
			});
		}
		if (this.rota.length === 1) this.rota.push({ x: residuo.x, y: residuo.y });
		this.progressoRota = 0;
	}

	atualizarRota(agora, jogador) {
		if (!this.rota) return;
		if (!this.alvo || this.alvo.recolhido) {
			this.limparRota();
			return;
		}

		const ultimoSegmento = this.rota.length - 2;
		const primeiroSegmento = Math.max(0, Math.floor(this.progressoRota) - 1);
		const ultimoSegmentoBusca = Math.min(ultimoSegmento, primeiroSegmento + 3);
		let maiorProgresso = this.progressoRota;

		for (let i = primeiroSegmento; i <= ultimoSegmentoBusca; i++) {
			const inicio = this.rota[i];
			const fim = this.rota[i + 1];
			const dx = fim.x - inicio.x;
			const dy = fim.y - inicio.y;
			const comprimento2 = dx * dx + dy * dy;
			const t = constrain(((jogador.x - inicio.x) * dx + (jogador.y - inicio.y) * dy) / comprimento2, 0, 1);
			const distancia = Math.hypot(jogador.x - (inicio.x + t * dx), jogador.y - (inicio.y + t * dy));
			const progresso = i + t;

			if (distancia < 20 && progresso >= this.progressoRota - 0.1) {
				maiorProgresso = Math.max(maiorProgresso, progresso);
			}
		}

		this.progressoRota = maiorProgresso;
		if (this.progressoRota >= this.rota.length - 1 - 0.05) this.limparRota();
	}

	limparRota() {
		this.alvo = null;
		this.rota = null;
		this.progressoRota = 0;
	}

	desenhar(agora) {
		const contexto = drawingContext;
		if (this.ativa && this.raio > 0) {
			contexto.save();
			contexto.beginPath();
			contexto.arc(this.x, this.y, this.raio, 0, Math.PI * 2);
			contexto.strokeStyle = 'rgba(70, 150, 255, 0.85)';
			contexto.lineWidth = 3;
			contexto.setLineDash([]);
			contexto.stroke();
			contexto.restore();
		}

		if (!this.rota || !this.alvo || this.alvo.recolhido) return;
		contexto.save();
		contexto.beginPath();
		contexto.strokeStyle = 'rgb(255, 200, 60)';
		contexto.lineWidth = 3;
		contexto.lineCap = 'round';
		contexto.setLineDash([8, 7]);
		const progressoTotal = Math.max(1, this.rota.length - 1);
		const opacidadeGlobal = 0.9 * (1 - 0.6 * this.progressoRota / progressoTotal);

		for (let i = 0; i < this.rota.length - 1; i++) {
			const segmentosAtras = Math.max(0, this.progressoRota - (i + 1));
			contexto.globalAlpha = opacidadeGlobal * Math.max(0, 1 - segmentosAtras / 2);
			contexto.beginPath();
			contexto.moveTo(this.rota[i].x, this.rota[i].y);
			contexto.lineTo(this.rota[i + 1].x, this.rota[i + 1].y);
			contexto.stroke();
		}
		contexto.restore();
	}

	rotulo(agora) {
		const restante = Math.max(0, this.cooldown - (agora - this.ultimaEmissao));
		return restante > 0 ? 'recarga ' + Math.ceil(restante / 1000) + ' s' : 'pronto';
	}
}
