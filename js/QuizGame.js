class QuizGame {
  constructor({ text, options, correctAnswer, onComplete }) {
    this.text = text;
    this.options = options;
    this.correctAnswer = correctAnswer;
    this.onComplete = onComplete;
    this.element = null;
    this.canProceed = false; 
  }

  createElement() {
    // Criar o elemento
    this.element = document.createElement("div");
    this.element.classList.add("QuizTutorial");

    this.element.innerHTML = `
      <p class="QuizTutorial_p"></p>
      <div class="error-message" style="color: red;"></div> <!-- Elemento para exibir mensagens de erro -->
      ${this.options ? this.renderOptions() : ''}
    `;

    // Iniciar o "efeito de escrita"
    this.revealingText = new RevealingText({
      element: this.element.querySelector(".QuizTutorial_p"),
      text: this.text
    });

    this.actionListener = new KeyPressListener("Enter", () => {
      if (this.canProceed) {
        this.done();
      }
    });
  }

  renderOptions() {
    return this.options.map((option, index) => 
      `<button class="QuizTutorial_button2" data-index="${index}">${option}</button>`
    ).join('');
  }

  handleAnswer(selectedIndex) {
    if (parseInt(selectedIndex) === this.correctAnswer) {
      this.canProceed = true; // Permitir que o jogador prossiga
      this.clearError(); // Limpa a mensagem de erro se houver
      this.done(); // Chama a função para processar a resposta correta
    } else {
      this.displayError("Você errou! Tente novamente."); // Exibe mensagem de erro
      this.canProceed = false; // Impede a conclusão até a resposta correta
      this.retryQuestion(); // Exibe novamente a pergunta
    }
  }

  // Método para exibir mensagens de erro
  displayError(message) {
    const errorMessageElement = this.element.querySelector(".error-message");
    errorMessageElement.textContent = message; // Define a mensagem de erro
  }

  // Método para limpar a mensagem de erro
  clearError() {
    const errorMessageElement = this.element.querySelector(".error-message");
    errorMessageElement.textContent = ""; // Limpa a mensagem de erro
  }

  // Método para reexibir a pergunta e as opções
  retryQuestion() {
    this.element.querySelector(".QuizTutorial_p").textContent = this.text; // Atualiza a pergunta
    this.element.querySelector(".error-message").textContent = ""; // Limpa a mensagem de erro
    this.element.querySelectorAll(".QuizTutorial_button2").forEach((button, index) => {
      button.textContent = this.options[index]; 
      button.classList.remove('disabled'); 
    });
  }

  done() {
    if (this.revealingText.isDone) {
      this.element.remove();
      this.actionListener.unbind();
      this.onComplete(); 
    } else {
      this.revealingText.warpToDone();
    }
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
    this.options && this.bindOptionButtons();
    this.revealingText.init();
  }

  bindOptionButtons() {
    this.element.querySelectorAll(".QuizTutorial_button2").forEach(button => {
      button.addEventListener("click", () => {
        this.handleAnswer(button.getAttribute("data-index"));
      });
    });
  }
}
