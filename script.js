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

const resetSimulatorButton = document.getElementById("resetSimulator");
const sustainabilityValue = document.getElementById("sustainabilityValue");
const productionValue = document.getElementById("productionValue");
const impactValue = document.getElementById("impactValue");
const costInitialValue = document.getElementById("costInitialValue");
const progressFill = document.getElementById("progressFill");
const resultProfileTitle = document.getElementById("resultProfileTitle");
const resultProfileDescription = document.getElementById("resultProfileDescription");
const profileSummary = document.querySelector(".profile-summary");
const simulatorResultPanel = document.querySelector(".simulator-result");
const simulatorOptionsContainer = document.querySelector(".simulator-options");
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

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
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
    item.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        const rawOption = answer.Option.replace(/^[A-D]\)\s*/, "");
        const label = String.fromCharCode(65 + index);
        button.className = "answer";
        button.type = "button";
        button.textContent = `${label}) ${rawOption}`;
        button.dataset.correct = answer.correct;
        button.dataset.answerLabel = label;
        button.dataset.answerText = rawOption;
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
        const correctButton = document.querySelector('.answer[data-correct="true"]');
        const correctLabel = correctButton?.dataset.answerLabel || "A";
        const correctText = correctButton?.dataset.answerText || item.answers.find((ans) => ans.correct).Option.replace(/^[A-D]\)\s*/, "");
        showExplanation(false, `A resposta correta é ${correctLabel}) ${correctText}. ${item.explanation}`, item.curiosity);
    }
}

function loadQuestion() {
    if (!questionElement || !spnQtd) return;
    const item = questions[currentIndex];
    const questionWithShuffledAnswers = {
        ...item,
        answers: shuffleArray(item.answers),
    };
    spnQtd.textContent = `${currentIndex + 1}/${questions.length}`;
    questionElement.textContent = item.question;
    buildAnswers(questionWithShuffledAnswers);
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

function getImpactLabel(value) {
    if (value <= 35) return "Baixo";
    if (value <= 55) return "Médio";
    if (value <= 75) return "Alto";
    return "Crítico";
}

function getCostLabel(value) {
    if (value <= 12) return "Baixo";
    if (value <= 22) return "Médio";
    return "Alto";
}

function getProducerProfile(production, sustainability, impact, cost) {
    if (cost > 22 && production >= 65 && sustainability >= 60 && impact <= 45) {
        return {
            title: "🔵 Produtor Tecnológico de Alto Custo",
            description: "Você investe em inovação com bons resultados, mas o custo inicial alto mostra que esse modelo exige capital e planejamento para ser sustentável no longo prazo."
        };
    }
    if (sustainability >= 70 && impact <= 45 && production >= 45 && cost <= 20) {
        return {
            title: "🟢 Produtor Sustentável Estratégico",
            description: "Seu foco está no equilíbrio: sustentabilidade forte, impacto controlado e produção estável. Esse é o caminho mais defensável para um futuro agro responsável."
        };
    }
    if (production >= 70 && sustainability <= 55 && impact >= 55) {
        return {
            title: "🟠 Produtor Produtivista",
            description: "A produção está em destaque, mas o impacto ambiental elevado e a sustentabilidade limitada mostram que ainda há risco para o longo prazo."
        };
    }
    if (impact >= 70 || sustainability <= 35) {
        return {
            title: "🔴 Produtor de Alto Impacto",
            description: "As escolhas favorecem ganhos de curto prazo, mas o impacto ambiental alto e a baixa sustentabilidade alertam para um modelo que precisa ser repensado."
        };
    }
    return {
        title: "🟡 Produtor em Transição",
        description: "Você está tomando boas decisões, mas algumas escolhas ainda podem ser ajustadas para melhorar o equilíbrio entre produção, custo e impacto ambiental."
    };
}

function updateOptionCardSelection() {
    const checkboxes = document.querySelectorAll(".simulator-options input[type='checkbox']");
    checkboxes.forEach((checkbox) => {
        const card = checkbox.closest(".option-card");
        if (!card) return;
        if (checkbox.checked) {
            card.classList.add("selected");
        } else {
            card.classList.remove("selected");
        }
    });
}

function calculateSimulator() {
    updateOptionCardSelection();
    const solar = document.getElementById("solar")?.checked;
    const irrigation = document.getElementById("irrigation")?.checked;
    const rotation = document.getElementById("rotation")?.checked;
    const precision = document.getElementById("precision")?.checked;
    const reserve = document.getElementById("reserve")?.checked;
    const fertilizers = document.getElementById("fertilizers")?.checked;
    const monoculture = document.getElementById("monoculture")?.checked;
    const compensation = document.getElementById("compensation")?.checked;
    const drought = document.getElementById("drought")?.checked;
    const biocontrol = document.getElementById("biocontrol")?.checked;
    const ilp = document.getElementById("ilp")?.checked;
    const recovery = document.getElementById("recovery")?.checked;

    let sustainability = 30;
    let production = 48;
    let impact = 50;
    let cost = 9;

    if (solar) {
        sustainability += 16;
        production += 5;
        impact -= 11;
        cost += 3;
    }
    if (irrigation) {
        sustainability += 8;
        production += 14;
        impact -= 13;
        cost += 2;
    }
    if (rotation) {
        sustainability += 18;
        production -= 4;
        impact -= 9;
        cost += 1;
    }
    if (precision) {
        sustainability += 10;
        production += 16;
        impact -= 12;
        cost += 3;
    }
    if (reserve) {
        sustainability += 20;
        production -= 8;
        impact -= 15;
        cost += 1;
    }
    if (fertilizers) {
        sustainability -= 6;
        production += 12;
        impact += 14;
        cost += 1;
    }
    if (monoculture) {
        sustainability -= 16;
        production += 18;
        impact += 18;
        cost += 1;
    }
    if (compensation) {
        sustainability += 10;
        production += 6;
        impact -= 7;
        cost += 2;
    }
    if (drought) {
        sustainability -= 6;
        production += 10;
        impact += 14;
        cost += 1;
    }
    if (biocontrol) {
        sustainability += 12;
        production += 2;
        impact -= 10;
        cost += 1;
    }
    if (ilp) {
        sustainability += 14;
        production += 8;
        impact -= 8;
        cost += 2;
    }
    if (recovery) {
        sustainability += 18;
        production -= 10;
        impact -= 12;
        cost += 2;
    }

    sustainability = Math.min(100, Math.max(0, Math.round(sustainability)));
    production = Math.min(100, Math.max(0, Math.round(production)));
    impact = Math.min(100, Math.max(0, Math.round(impact)));
    cost = Math.max(0, Math.round(cost));

    const impactLabel = getImpactLabel(impact);
    const costLabel = getCostLabel(cost);
    const profile = getProducerProfile(production, sustainability, impact, cost);

    if (sustainabilityValue) sustainabilityValue.textContent = `${sustainability}%`;
    if (productionValue) productionValue.textContent = `${production}%`;
    if (impactValue) impactValue.textContent = impactLabel;
    if (costInitialValue) costInitialValue.textContent = costLabel;
    if (progressFill) progressFill.style.width = `${sustainability}%`;
    if (resultProfileTitle) resultProfileTitle.textContent = profile.title;
    if (resultProfileDescription) resultProfileDescription.textContent = profile.description;

    if (resultNote) {
        if (costLabel === "Alto") {
            resultNote.textContent = "O custo inicial ficou alto. Pense em combinar opções para encontrar o melhor equilíbrio entre produção, sustentabilidade e impacto.";
        } else if (impactLabel === "Crítico" || impactLabel === "Alto") {
            resultNote.textContent = "Seu modelo ainda apresenta alto impacto ambiental. Busque reduzir o uso intensivo e equilibrar com práticas regenerativas.";
        } else {
            resultNote.textContent = "Boas escolhas! Observe o equilíbrio entre produção, sustentabilidade e custo para manter seu plano viável.";
        }
    }
}

function resetSimulator() {
    const checkboxes = document.querySelectorAll(".simulator-options input[type='checkbox']");
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
        const card = checkbox.closest(".option-card");
        if (card) card.classList.remove("selected");
    });

    if (resultProfileTitle) resultProfileTitle.textContent = "Pronto para jogar";
    if (resultProfileDescription) resultProfileDescription.textContent = "Selecione até 5 escolhas para montar sua estratégia sustentável e veja o perfil do produtor.";
    if (sustainabilityValue) sustainabilityValue.textContent = "30%";
    if (productionValue) productionValue.textContent = "48%";
    if (impactValue) impactValue.textContent = "Moderado";
    if (costInitialValue) costInitialValue.textContent = "Médio";
    if (progressFill) progressFill.style.width = "30%";
    if (resultNote) resultNote.textContent = "Comece escolhendo práticas que equilibrem produção, impacto e custo.";
}

if (resetSimulatorButton) {
    resetSimulatorButton.addEventListener("click", () => {
        resetSimulator();
        calculateSimulator();
        window.scrollTo({ top: simulatorOptionsContainer?.offsetTop || 0, behavior: "smooth" });
    });
}

const simulatorCheckboxes = document.querySelectorAll(".simulator-options input[type='checkbox']");
simulatorCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", calculateSimulator);
});

calculateSimulator();

// Keep simulator-result visually aligned with left options
function syncResultPanelHeight() {
    const left = document.querySelector('.simulator-options');
    const right = document.querySelector('.simulator-result');
    if (!left || !right) return;

    // compute positions relative to the page so we can align bottoms
    const leftRect = left.getBoundingClientRect();
    const rightRect = right.getBoundingClientRect();
    const leftPageTop = leftRect.top + window.scrollY;
    const leftPageBottom = leftPageTop + left.offsetHeight;
    const rightPageTop = rightRect.top + window.scrollY;

    // desired max height so right bottom aligns with left bottom (minus small breathing room)
    let desiredMax = Math.floor(leftPageBottom - rightPageTop - 12);
    // floor and sanity clamps
    const minHeight = 200;
    if (desiredMax < minHeight) desiredMax = Math.max(minHeight, left.offsetHeight - 16);

    right.style.maxHeight = desiredMax + 'px';
}

// Observe size changes and window resize/scroll
const roLeft = new ResizeObserver(() => {
    syncResultPanelHeight();
});
const leftCol = document.querySelector('.simulator-options');
if (leftCol) roLeft.observe(leftCol);
window.addEventListener('resize', syncResultPanelHeight);
window.addEventListener('load', syncResultPanelHeight);
window.addEventListener('scroll', () => {
    // minor throttle
    requestAnimationFrame(syncResultPanelHeight);
});

// parana-card mouse-follow removed: no JS needed for hover highlight

const tooltipButtons = document.querySelectorAll(".info-icon");
const tooltipCards = document.querySelectorAll(".result-card");

tooltipButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        event.stopPropagation();
        const card = button.closest(".result-card");
        if (!card) return;
        const isActive = card.classList.contains("active-tooltip");
        tooltipCards.forEach((other) => {
            other.classList.remove("active-tooltip");
            const obtn = other.querySelector('.info-icon');
            if (obtn) obtn.setAttribute('aria-expanded', 'false');
        });
        if (!isActive) {
            card.classList.add("active-tooltip");
            button.setAttribute('aria-expanded', 'true');
        } else {
            card.classList.remove("active-tooltip");
            button.setAttribute('aria-expanded', 'false');
        }
    });
});

tooltipCards.forEach((card) => {
    card.addEventListener('click', (event) => {
        if (event.target.closest('.info-icon')) return;
        const isActive = card.classList.contains('active-tooltip');
        tooltipCards.forEach((other) => {
            other.classList.remove('active-tooltip');
            const obtn = other.querySelector('.info-icon');
            if (obtn) obtn.setAttribute('aria-expanded', 'false');
        });
        if (!isActive) {
            card.classList.add('active-tooltip');
            const btn = card.querySelector('.info-icon');
            if (btn) btn.setAttribute('aria-expanded', 'true');
        }
    });
});

document.addEventListener("click", (event) => {
    if (!event.target.closest(".result-card")) {
        tooltipCards.forEach((card) => {
            card.classList.remove("active-tooltip");
            const btn = card.querySelector('.info-icon');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        });
    }
});

// show tooltip on mouse hover (desktop) using pointer events
tooltipCards.forEach((card) => {
    card.addEventListener('pointerenter', (ev) => {
        if (ev.pointerType && ev.pointerType !== 'mouse') return; // ignore touch
        tooltipCards.forEach((other) => {
            other.classList.remove('active-tooltip');
            const obtn = other.querySelector('.info-icon');
            if (obtn) obtn.setAttribute('aria-expanded', 'false');
        });
        card.classList.add('active-tooltip');
        const btn = card.querySelector('.info-icon');
        if (btn) btn.setAttribute('aria-expanded', 'true');
    });
    card.addEventListener('pointerleave', (ev) => {
        if (ev.pointerType && ev.pointerType !== 'mouse') return;
        card.classList.remove('active-tooltip');
        const btn = card.querySelector('.info-icon');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    });
});

if (questionElement && answersElement && spnQtd && progressStep) {
    loadQuestion();
}

function initScrollReveal() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const revealTargets = document.querySelectorAll(
        '.section-label, h1, h2, h3, p, img, .card, .feature-card, .parana-card, .stat-card, .hero-card, .hero-info div, .visual-card, .button, .result-card, .simulator-header, .simulator-options .option-card, .simulator-result, .footer-content, .quiz-hero, .quiz-card, .quiz-stats, .history-copy, .history-hero-img, .timeline-item, .timeline-content, .history-cards, .content-grid, .summary-grid article'
    );

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.16,
            rootMargin: '0px 0px -10% 0px',
        }
    );

    revealTargets.forEach((element) => {
        element.classList.add('reveal');
        observer.observe(element);
    });
}

initScrollReveal();
