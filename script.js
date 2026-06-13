import questions from "./questions.js";

const questionElement = document.querySelector(".question");
const answersElement = document.querySelector(".answers");
const spnQtd = document.querySelector(".spnQtd");
const progressStep = document.getElementById("progressStep");
const finishSection = document.querySelector(".quiz-finish");
const finishText = document.querySelector(".finish-text");
const finishDetail = document.querySelector(".finish-detail");
const restartButton = document.getElementById("restartButton");
const nextQuestionButton = document.getElementById("nextQuestionButton");
const explanationCard = document.getElementById("explanationCard");
const explanationStatus = document.getElementById("explanationStatus");
const explanationMessage = document.getElementById("explanationMessage");
const explanationCuriosity = document.getElementById("explanationCuriosity");
const quizContent = document.querySelector(".quiz-content");

const calculateButton = document.getElementById("calculate");
const sustainabilityValue = document.getElementById("sustainabilityValue");
const productionValue = document.getElementById("productionValue");
const impactValue = document.getElementById("impactValue");
const progressFill = document.getElementById("progressFill");
const resultNote = document.getElementById("resultNote");

let currentIndex = 0;
let correctCount = 0;

function updateProgress() {
    if (!progressStep) return;
    const percent = ((currentIndex + 1) / questions.length) * 100;
    progressStep.style.width = `${percent}%`;
}

function setResultMessage(score) {
    if (score === questions.length) {
        return {
            title: "Excelente!",
            detail: "Você domina os conceitos de agro sustentável e inovação no campo."
        };
    }
    if (score >= 7) {
        return {
            title: "Muito bom!",
            detail: "Você está no caminho certo para um futuro agro mais sustentável."
        };
    }
    if (score >= 4) {
        return {
            title: "Bom começo!",
            detail: "Continue aprendendo sobre práticas sustentáveis no agro."
        };
    }
    return {
        title: "Vamos melhorar",
        detail: "O tema agro sustentável merece ainda mais atenção."
    };
}

function endQuiz() {
    if (!quizContent || !finishSection || !finishText || !finishDetail) return;
    quizContent.style.display = "none";
    finishSection.style.display = "grid";
    const result = setResultMessage(correctCount);
    finishText.textContent = `${result.title} Você acertou ${correctCount} de ${questions.length}.`;
    finishDetail.textContent = result.detail;
}

function clearAnswers() {
    if (!answersElement) return;
    answersElement.innerHTML = "";
}

function hideExplanation() {
    if (!explanationCard) return;
    explanationCard.classList.add("hidden");
}

function showExplanation(isCorrect, text, curiosity) {
    if (!explanationCard || !explanationStatus || !explanationMessage || !explanationCuriosity) return;
    explanationCard.classList.remove("hidden");
    explanationCard.classList.toggle("correct-card", isCorrect);
    explanationCard.classList.toggle("wrong-card", !isCorrect);
    explanationStatus.textContent = isCorrect ? "✅ Resposta correta" : "❌ Resposta incorreta";
    explanationMessage.textContent = text;
    explanationCuriosity.textContent = curiosity ? `Curiosidade: ${curiosity}` : "";
}

function buildAnswers(item) {
    if (!answersElement) return;
    clearAnswers();
    hideExplanation();
    item.answers.forEach((answer) => {
        const button = document.createElement("button");
        button.className = "answer";
        button.type = "button";
        button.textContent = answer.Option;
        button.dataset.correct = answer.correct;
        button.addEventListener("click", handleAnswerClick);
        answersElement.appendChild(button);
    });
}

function handleAnswerClick(event) {
    const selected = event.currentTarget;
    const isCorrect = selected.dataset.correct === "true";
    selected.classList.add(isCorrect ? "correct" : "wrong");

    document.querySelectorAll(".answer").forEach((button) => {
        button.classList.add("disable");
        button.disabled = true;
    });

    const item = questions[currentIndex];
    if (isCorrect) {
        correctCount++;
        showExplanation(true, item.explanation, item.curiosity);
    } else {
        showExplanation(false, `A resposta correta é ${item.answers.find((ans) => ans.correct).Option}. ${item.explanation}`, item.curiosity);
    }
}

function loadQuestion() {
    if (!questionElement || !spnQtd) return;
    const item = questions[currentIndex];
    spnQtd.textContent = `${currentIndex + 1}/${questions.length}`;
    questionElement.textContent = item.question;
    buildAnswers(item);
    updateProgress();
}

function restartQuiz() {
    if (!quizContent || !finishSection) return;
    currentIndex = 0;
    correctCount = 0;
    hideExplanation();
    quizContent.style.display = "grid";
    finishSection.style.display = "none";
    loadQuestion();
}

function goNextQuestion() {
    if (currentIndex < questions.length - 1) {
        currentIndex++;
        loadQuestion();
    } else {
        endQuiz();
    }
}

if (nextQuestionButton) {
    nextQuestionButton.addEventListener("click", goNextQuestion);
}

if (restartButton) {
    restartButton.addEventListener("click", restartQuiz);
}

function calculateSimulator() {
    const solar = document.getElementById("solar")?.checked;
    const irrigation = document.getElementById("irrigation")?.checked;
    const planting = document.getElementById("planting")?.checked;
    const preservation = document.getElementById("preservation")?.checked;

    let sustainability = 10;
    let production = 45;
    let impact = 72;

    if (solar) {
        sustainability += 20;
        production += 8;
        impact -= 16;
    }
    if (irrigation) {
        sustainability += 18;
        production += 10;
        impact -= 20;
    }
    if (planting) {
        sustainability += 16;
        production += 12;
        impact -= 18;
    }
    if (preservation) {
        sustainability += 22;
        production += 6;
        impact -= 25;
    }

    sustainability = Math.min(100, sustainability);
    production = Math.min(100, production);
    impact = Math.max(10, impact);

    if (sustainabilityValue) sustainabilityValue.textContent = `${sustainability}%`;
    if (productionValue) productionValue.textContent = `${production}%`;
    if (progressFill) progressFill.style.width = `${sustainability}%`;

    if (impactValue && resultNote) {
        if (impact <= 30) {
            impactValue.textContent = "Baixo";
            resultNote.textContent = "Seu projeto está alinhado com o futuro sustentável.";
        } else if (impact <= 55) {
            impactValue.textContent = "Médio";
            resultNote.textContent = "Existem boas escolhas, mas ainda há espaço para melhoria.";
        } else {
            impactValue.textContent = "Alto";
            resultNote.textContent = "Inclua mais práticas verdes para reduzir o impacto.";
        }
    }
}

if (calculateButton) {
    calculateButton.addEventListener("click", calculateSimulator);
}

if (questionElement && answersElement && spnQtd && progressStep) {
    loadQuestion();
}
