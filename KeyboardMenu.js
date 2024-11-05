class KeyboardMenu {
  constructor(config = {}) {
    this.options = [];
    this.prevFocus = null;
    this.descriptionContainer = config.descriptionContainer || null;
    this.cursors = null; // Para armazenar os controles do Phaser
  }

  setOptions(options) {
    this.options = options;
    this.element.innerHTML = this.options.map((option, index) => {
      const disabledAttr = option.disabled ? "disabled" : "";
      return (`
        <div class="option">
          <button ${disabledAttr} data-button="${index}" data-description="${option.description}">
            ${option.label}
          </button>
          <span class="right">${option.right ? option.right() : ""}</span>
        </div>
      `);
    }).join("");

    this.element.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", () => {
        const chosenOption = this.options[Number(button.dataset.button)];
        chosenOption.handler();
      });
      button.addEventListener("mouseenter", () => {
        button.focus();
      });
      button.addEventListener("focus", () => {
        this.prevFocus = button;
        this.descriptionElementText.innerText = button.dataset.description;
      });
    });

    setTimeout(() => {
      this.element.querySelector("button[data-button]:not([disabled])").focus();
    }, 10);
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("KeyboardMenu");

    this.descriptionElement = document.createElement("div");
    this.descriptionElement.classList.add("DescriptionBox");
    this.descriptionElement.innerHTML = `<p>I will provide information!</p>`;
    this.descriptionElementText = this.descriptionElement.querySelector("p");
  }

  end() {
    this.element.remove();
    this.descriptionElement.remove();
  }

  init(container, cursors) {
    this.createElement();
    (this.descriptionContainer || container).appendChild(this.descriptionElement);
    container.appendChild(this.element);

    // Armazena os controles do Phaser passados
    this.cursors = cursors;

    // Atualiza o foco com base na entrada do teclado
    this.updateFocus();
  }

  updateFocus() {
    // Verifica se as setas para cima ou para baixo estão pressionadas
    if (this.cursors.up.isDown) {
      const current = Number(this.prevFocus.getAttribute("data-button"));
      const prevButton = Array.from(this.element.querySelectorAll("button[data-button]")).reverse().find(el => {
        return el.dataset.button < current && !el.disabled;
      });
      prevButton?.focus();
    } else if (this.cursors.down.isDown) {
      const current = Number(this.prevFocus.getAttribute("data-button"));
      const nextButton = Array.from(this.element.querySelectorAll("button[data-button]")).find(el => {
        return el.dataset.button > current && !el.disabled;
      });
      nextButton?.focus();
    }
  }
}
