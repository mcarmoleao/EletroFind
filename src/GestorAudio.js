class GestorAudio {
	constructor() {
		this.microfone = null;
		this.iniciado = false;
		this.aIniciar = false;
		this.pronto = false;
		this.erro = false;
		this.armado = true;
		this.duracaoCalibracao = 3000;
		this.calibrando = false;
		this.inicioCalibracao = 0;
		this.somaCalibracao = 0;
		this.amostrasCalibracao = 0;
		this.ruidoBase = 0;
		this.nivelAtual = 0;
		this.limiarDisparo = 0.12;
		this.limiarRearme = 0.075;
		this.sons = {};
		this.musicaSelecionada = null;
	}

	carregarSons() {
		const ficheiros = {
			backgroundMusic: 'assets/backgroundMusic.mp3',
			challengeMusic: 'assets/challengeMusic.mp3',
			itemPickUp: 'assets/itemPickUp.mp3',
			itemDrop: 'assets/itemDrop.mp4',
			endLevel: 'assets/endLevel.mp3'
		};

		for (const [nome, caminho] of Object.entries(ficheiros)) {
			this.sons[nome] = loadSound(
				caminho,
				() => this.iniciarMusicaCarregada(nome),
				erro => console.error('Não foi possível carregar o som "' + caminho + '".', erro)
			);
		}
	}

	iniciarMusica(desafio) {
		this.musicaSelecionada = desafio ? 'challengeMusic' : 'backgroundMusic';
		this.iniciarMusicaCarregada(this.musicaSelecionada);
	}

	iniciarMusicaCarregada(nome) {
		if (nome !== this.musicaSelecionada) return;

		const musica = this.sons[nome];
		if (!musica || !musica.isLoaded() || musica.isPlaying()) return;

		musica.setVolume(0.35);
		musica.loop();
	}

	pararMusica() {
		const musica = this.sons[this.musicaSelecionada];
		this.musicaSelecionada = null;
		if (musica && musica.isPlaying()) musica.stop();
	}

	tocarEfeito(nome) {
		const som = this.sons[nome];
		if (som && som.isLoaded()) som.play();
	}

	iniciar() {
		this.iniciado = true;
		this.erro = false;
		if (this.aIniciar) return;
		if (this.pronto) {
			this.iniciarCalibracao();
			return;
		}

		if (typeof p5.AudioIn !== 'function') {
			this.erro = true;
			console.error('O microfone não está disponível nesta versão do p5.sound.');
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
					this.iniciarCalibracao();
				},
				erro => {
					this.pronto = false;
					this.erro = true;
					this.aIniciar = false;
					console.error('Não foi possível obter acesso ao microfone.', erro);
				}
			);
		} catch (e) {
			this.aIniciar = false;
			this.erro = true;
			console.error('Não foi possível iniciar o microfone.', e);
		}
	}

	iniciarCalibracao() {
		this.calibrando = true;
		this.inicioCalibracao = millis();
		this.somaCalibracao = 0;
		this.amostrasCalibracao = 0;
		this.nivelAtual = 0;
	}

	atualizarCalibracao() {
		if (!this.calibrando || !this.pronto || !this.microfone) return false;

		this.nivelAtual = this.microfone.getLevel();
		this.somaCalibracao += this.nivelAtual;
		this.amostrasCalibracao++;

		if (millis() - this.inicioCalibracao < this.duracaoCalibracao) return false;

		this.ruidoBase = this.somaCalibracao / this.amostrasCalibracao;
		this.limiarDisparo = Math.max(0.12, this.ruidoBase * 2.5);
		this.limiarRearme = Math.max(this.ruidoBase * 1.5, this.limiarDisparo * 0.65);
		this.armado = true;
		this.calibrando = false;
		return true;
	}

	detetarGrito(podeEmitir = true) {
		if (!this.pronto || !this.microfone || this.calibrando) return false;

		this.nivelAtual = this.microfone.getLevel();
		if (this.nivelAtual <= this.limiarRearme) this.armado = true;
		if (podeEmitir && this.armado && this.nivelAtual >= this.limiarDisparo) {
			this.armado = false;
			return true;
		}
		return false;
	}

	progressoCalibracao() {
		if (!this.calibrando) return 1;
		return constrain((millis() - this.inicioCalibracao) / this.duracaoCalibracao, 0, 1);
	}

	telemetria() {
		return {
			nivel: this.nivelAtual,
			ruidoBase: this.ruidoBase,
			limiarRearme: this.limiarRearme,
			limiarDisparo: this.limiarDisparo,
			disponivel: this.pronto
		};
	}

	rotulo() {
		if (this.erro) return 'microfone indisponível';
		if (!this.iniciado) return 'microfone por autorizar';
		if (!this.pronto) return 'a ligar microfone';
		return 'microfone ativo · faz um som alto';
	}
}
