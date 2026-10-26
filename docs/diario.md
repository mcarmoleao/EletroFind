# Diário de desenvolvimento — EletroFind

## 17 de outubro de 2026 — Estrutura inicial e primeiras tentativas

Foi criada a estrutura base do projeto em p5.js: página HTML, sketch principal e classes iniciais para o jogador, o labirinto, o contentor, os resíduos, a interface e a onda. Também foram incluídas no projeto as bibliotecas locais do p5.js e do p5.sound.

Nesta fase começaram as primeiras tentativas de implementar a lógica e a navegação. O trabalho foi sendo ajustado para separar responsabilidades entre os ficheiros e permitir desenvolver o jogo por partes.

## 17 de outubro de 2026 — Melhorias à lógica e expansão do labirinto

Foram desenvolvidos os menus, as estatísticas e os primeiros níveis. O mapa foi ampliado e passou a ser acompanhado por uma câmara, para permitir jogar numa área maior do que a janela visível. Foram também melhorados o movimento, as colisões e os elementos de recolha e entrega.

## 21 de outubro de 2026 — Lógica dos níveis e desafio aleatório

Foi consolidada a lógica principal do jogo e foram definidos os mapas e as posições fixas dos resíduos para os níveis. Foi acrescentada a geração procedural do labirinto para o modo de desafio aleatório, incluindo variação das dimensões e criação de caminhos alternativos.

## 23 de outubro de 2026 — Ativação por som e orientação até aos resíduos

Foi implementada a ativação da onda através do microfone. A onda pode revelar um caminho até a um resíduo, calculado por pesquisa em largura na grelha do labirinto. A interface passou a apresentar informação relacionada com o áudio e com a funcionalidade da onda.

## 25 de outubro de 2026 — Efeitos sonoros e calibração do microfone

Foram adicionados ficheiros de áudio para a música dos níveis, a música do desafio e os efeitos de recolha, entrega e conclusão. Foi também implementada uma calibração do microfone antes da execução, com limiares de disparo e rearme para evitar ativações repetidas enquanto o som continua acima do limiar.


