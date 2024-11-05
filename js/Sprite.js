import { GameObjects, Scene, Animation } from 'phaser'; 

class Sprite {
  constructor(scene, config) {
    this.scene = scene; // Referência à cena do Phaser
    this.texture = config.texture; // Nome da textura do sprite

    // Cria a imagem do sprite usando Phaser
    this.sprite = new GameObjects.Sprite(scene, config.x, config.y, this.texture);
    
    // Carregando a imagem
    this.image = scene.add.image(0, 0, this.texture);
    this.image.setOrigin(0.5, 0.5); // Centraliza a imagem

    // Configurando animações do objeto
    this.animations = config.animations || {
      "idle-down": [[0, 0]],
      "idle-right": [[0, 1]],
      "idle-up": [[0, 2]],
      "idle-left": [[0, 3]],
      "walk-down": [[1, 0], [0, 0], [3, 0], [0, 0]],
      "walk-right": [[1, 1], [0, 1], [3, 1], [0, 1]],
      "walk-up": [[1, 2], [0, 2], [3, 2], [0, 2]],
      "walk-left": [[1, 3], [0, 3], [3, 3], [0, 3]]
    };

    this.currentAnimation = config.currentAnimation || "idle-right";
    this.currentAnimationFrame = 0;
    this.animationFrameLimit = config.animationFrameLimit || 8;
    this.animationFrameProgress = this.animationFrameLimit;

    // Adiciona a sprite à cena
    scene.add.existing(this.sprite);
  }

  // Getter dos frames da animação
  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  // Método que determina as animações para diferentes ações de movimentação
  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  // Atualiza o progresso da animação
  updateAnimationProgress() {
    // Diminuir o progresso
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    // Resetar o contador da animação
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    // Retornar ao estado inicial da animação se necessário
    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  // Como os objetos serão desenhados
  draw(cameraPerson) {
    // Atualiza a posição do sprite com base na câmera
    this.sprite.x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraPerson.x;
    this.sprite.y = this.gameObject.y - 18 + utils.withGrid(6) - cameraPerson.y;

    // Atualiza o frame do sprite
    const [frameX, frameY] = this.frame;
    this.sprite.setFrame(frameX + (frameY * 4)); 

    this.updateAnimationProgress();
  }
}

const utils = {
  withGrid(n) {
    return n * 32; // 32 é o tamanho da grade
  }
};
