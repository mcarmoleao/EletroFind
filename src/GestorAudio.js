class GestorAudio {
	constructor() {
		this.microfone = null;
		this.iniciado = false;
		this.aIniciar = false;
		this.pronto = false;
		this.erro = false;
		this.armado = true;
		this.limiar = 0.12;
	}

	iniciar() {
		if (this.pronto || this.aIniciar) return;
		this.iniciado = true;
		this.erro = false;

		if (typeof p5.AudioIn !== 'function') {
			this.erro = true;
			return;
		}

		try {
			if (!this.microfone) this.microfone = new p5.AudioIn();
			this.aIniciar = true;
			this.microfone.start(
				() => {
					this.pronto = true;
					this.erro = false;
					this.aIniciar = false;
				},
				() => {
					this.pronto = false;
					this.erro = true;
					this.aIniciar = false;
				}
			);
		} catch (e) {
			this.aIniciar = false;
			this.erro = true;
		}
	}

	detetarGrito(podeEmitir = true) {
		if (!this.pronto || !this.microfone) return false;

		const nivel = this.microfone.getLevel();
		if (nivel < this.limiar * 0.75) this.armado = true;
		if (podeEmitir && this.armado && nivel >= this.limiar) {
			this.armado = false;
			return true;
		}
		return false;
	}

	rotulo() {
		if (this.erro) return 'microfone indisponível';
		if (!this.iniciado) return 'microfone por autorizar';
		if (!this.pronto) return 'a ligar microfone';
		return 'microfone ativo · faz um som alto';
	}
}
