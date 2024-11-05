class OverworldEvent {
  constructor({ map, event }) {
    this.map = map;
    this.event = event;

    // Bind do método init
    this.init = this.init.bind(this);
  }

  // Método auxiliar para emitir eventos
  emitEvent(name, detail) {
    const event = new CustomEvent(name, { detail });
    document.dispatchEvent(event);
  }

  stand(resolve) {
    const who = this.map.gameObjects[this.event.who];
    who.startBehavior({ map: this.map }, {
      type: "stand",
      direction: this.event.direction,
      time: this.event.time,
    });

    // Usar Phaser para lidar com eventos de conclusão
    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandComplete", completeHandler);
        resolve();
      }
    };
    document.addEventListener("PersonStandComplete", completeHandler);
  }

  walk(resolve) {
    const who = this.map.gameObjects[this.event.who];
    who.startBehavior({ map: this.map }, {
      type: "walk",
      direction: this.event.direction,
      retry: true,
    });

    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
      }
    };
    document.addEventListener("PersonWalkingComplete", completeHandler);
  }

  textMessage(resolve) {
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
    }

    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve(),
    });
    message.init(document.querySelector(".game-container"));
  }

  quizGame(resolve) {
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
    }

    const quizGame = new QuizGame({
      text: this.event.text,
      options: this.event.options,
      correctAnswer: this.event.correctAnswer,
      onComplete: () => resolve(),
    });
    quizGame.init(document.querySelector(".game-container"));
  }

  changeMap(resolve) {
    const sceneTransition = new SceneTransition();
    sceneTransition.init(document.querySelector(".game-container"), () => {
      this.map.overworld.startMap(window.OverworldMaps[this.event.map]);
      resolve();
      sceneTransition.fadeOut();
    });
  }

  addStoryFlag(resolve) {
    window.playerState.storyFlags[this.event.flag] = true;
    resolve();
  }

  pause(resolve) {
    console.log("JOGO PAUSADO!");
    this.map.isPaused = true;

    const menu = new PauseMenu({
      onComplete: () => {
        resolve();
        this.map.isPaused = false;
        this.map.overworld.startGameLoop();
      },
    });
    menu.init(document.querySelector(".game-container"));
  }

  init() {
    return new Promise(resolve => {
      // Chama o método baseado no tipo de evento
      (() => this[this.event.type](resolve))();
    });
  }
}