const question = document.querySelector(".question");
const answers = document.querySelector(".answers");
const spnQtd = document.querySelector(".spnQtd");
const textFinish = document.querySelector(".finish span");
const content = document.querySelector(".content");
const contentFinish = document.querySelector(".finish");
const btnRestart = document.querySelector(".finish button");


import questions from "./questions.js";

let currenttIndex = 0;
let questionCorrect = 0;

btnRestart.onclick = () => {
    content.style.display = "flex";
    contentFinish.style.display = "none";

    currenttIndex = 0;
    questionCorrect = 0;
    loadQuestion();
};

function nextQuestion(e) {
    const isCorrect = e.target.getAttribute("data-correct") === "true";

    // Aplica estilos de acerto/erro
    if (isCorrect) {
        e.target.style.backgroundColor = "#2ecc71"; // verde
        e.target.style.color = "#fff";
    } else {
        e.target.style.backgroundColor = "#e74c3c"; // vermelho
        e.target.style.color = "#fff";
    }

    // Desativa os botões após a resposta
    document.querySelectorAll(".answer").forEach(btn => {
        btn.disabled = true;
    });

    // Espera um tempo antes de ir para a próxima pergunta
    setTimeout(() => {
        if (isCorrect) questionCorrect++;

        if (currenttIndex < questions.length - 1) {
            currenttIndex++;
            loadQuestion();
        } else {
            finish();
        }
    }, 1000);
}

function finish() {
    textFinish.innerHTML = `Você acertou ${questionCorrect} de ${questions.length}`;
    content.style.display = "none";
    contentFinish.style.display = "flex";
}

function loadQuestion() {
    spnQtd.innerHTML = `${currenttIndex + 1}/${questions.length}`;
    const item = questions[currenttIndex];
    answers.innerHTML = "";
    question.innerHTML = item.question;

    item.answers.forEach((answer) => {
        const div = document.createElement("div");

        div.innerHTML = `
    <button class="answer" data-correct="${answer.correct}">
    ${answer.Option}
    </button>
    `;

        answers.appendChild(div);
    });

    document.querySelectorAll(".answer").forEach((item) => {
        item.addEventListener("click", nextQuestion);
    });
}



loadQuestion();