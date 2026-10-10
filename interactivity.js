const activationTabs = [...document.querySelectorAll("[data-activation]")];
const activationPanels = [...document.querySelectorAll("[data-activation-panel]")];
const activationStep = document.querySelector("#activation-step");

function selectActivation(tab, moveFocus = false) {
  if (!tab) return;
  const selectedType = tab.dataset.activation;
  activationTabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  activationPanels.forEach((panel) => { panel.hidden = panel.dataset.activationPanel !== selectedType; });
  if (activationStep) {
    const index = activationTabs.indexOf(tab) + 1;
    activationStep.textContent = `${String(index).padStart(2, "0")} / ${String(activationTabs.length).padStart(2, "0")}`;
  }
  if (moveFocus) tab.focus();
}

activationTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectActivation(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0
      : event.key === "End" ? activationTabs.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + activationTabs.length) % activationTabs.length;
    selectActivation(activationTabs[next], true);
  });
});

const quizQuestions = [
  { title: "O que você quer que o público perceba primeiro?", answers: [
    ["Conteúdo com grande impacto visual", "visual"], ["Voz e música com clareza", "audio"], ["Um ambiente com clima marcante", "lighting"], ["Uma experiência para participar", "interactive"]
  ] },
  { title: "Que conteúdo precisa ganhar destaque?", answers: [
    ["Apresentações e informações", "visual"], ["Vídeos e imagens da marca", "visual"], ["Falas de quem está no palco", "audio"], ["Uma dinâmica com o público", "interactive"]
  ] },
  { title: "O que o espaço do evento mais precisa?", answers: [
    ["Telas ou painel de LED", "visual"], ["Microfones e sonorização", "audio"], ["Luz para valorizar o ambiente", "lighting"], ["Equipe para operar a estrutura", "operations"]
  ] },
  { title: "Como você gostaria de envolver os convidados?", answers: [
    ["Com quiz ou votação", "interactive"], ["Com jogos e desafios", "interactive"], ["Com música, luz e conteúdo", "lighting"], ["Com imagens que marcam o evento", "visual"]
  ] }
];
const quizCategories = {
  visual: "painel de LED e telas",
  audio: "sonorização profissional",
  lighting: "iluminação cênica",
  interactive: "jogos e ativações digitais",
  operations: "operação técnica integrada"
};
const quizQuestionTitle = document.querySelector("#quiz-question-title");
const quizChoices = document.querySelector("#quiz-choices");
const quizCount = document.querySelector("#quiz-question-count");
const quizProgress = document.querySelector("#quiz-progress-fill");
const quizFeedback = document.querySelector("#quiz-feedback");
const quizNext = document.querySelector("#quiz-next");
const quizRestart = document.querySelector("#quiz-restart");
const quizCta = document.querySelector("#quiz-cta");
let quizQuestionIndex = 0;
let quizAnswers = [];

function renderQuizQuestion() {
  if (!quizQuestionTitle || !quizChoices) return;
  const question = quizQuestions[quizQuestionIndex];
  quizQuestionTitle.textContent = question.title;
  quizCount.textContent = `PERGUNTA ${quizQuestionIndex + 1} DE ${quizQuestions.length}`;
  quizProgress.style.width = `${((quizQuestionIndex + 1) / quizQuestions.length) * 100}%`;
  quizChoices.hidden = false;
  quizChoices.innerHTML = question.answers.map(([label, category]) => `<button type="button" data-quiz-answer="${category}" aria-pressed="false">${label}<span aria-hidden="true">↗</span></button>`).join("");
  quizChoices.querySelectorAll("[data-quiz-answer]").forEach((choice) => choice.addEventListener("click", () => {
    quizChoices.querySelectorAll("[data-quiz-answer]").forEach((option) => option.setAttribute("aria-pressed", String(option === choice)));
    quizAnswers[quizQuestionIndex] = choice.dataset.quizAnswer;
    if (quizFeedback) quizFeedback.textContent = "Boa escolha. Cada detalhe ajuda a desenhar uma experiência mais completa.";
    if (quizNext) {
      quizNext.hidden = false;
      quizNext.innerHTML = quizQuestionIndex === quizQuestions.length - 1 ? "Ver sugestão audiovisual <span aria-hidden=\"true\">→</span>" : "Próxima pergunta <span aria-hidden=\"true\">→</span>";
    }
  }));
}

function finishQuiz() {
  const scores = quizAnswers.reduce((result, category) => ({ ...result, [category]: (result[category] || 0) + 1 }), {});
  const recommendations = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([category]) => quizCategories[category]);
  quizQuestionTitle.textContent = "Uma boa experiência integra os recursos certos.";
  quizChoices.hidden = true;
  quizProgress.style.width = "100%";
  if (quizCount) quizCount.textContent = "SUGESTÃO PARA O SEU EVENTO";
  if (quizFeedback) quizFeedback.textContent = `Pelas suas escolhas, vale considerar ${recommendations.join(" e ")}. A Brave Bear planeja a combinação e acompanha a operação no evento.`;
  if (quizNext) quizNext.hidden = true;
  if (quizRestart) quizRestart.hidden = false;
  if (quizCta) quizCta.hidden = false;
}

quizNext?.addEventListener("click", () => {
  if (!quizAnswers[quizQuestionIndex]) return;
  if (quizQuestionIndex === quizQuestions.length - 1) return finishQuiz();
  quizQuestionIndex += 1;
  quizNext.hidden = true;
  if (quizFeedback) quizFeedback.textContent = "Escolha a opção que mais combina com o seu evento.";
  renderQuizQuestion();
});
quizRestart?.addEventListener("click", () => {
  quizQuestionIndex = 0;
  quizAnswers = [];
  quizNext.hidden = true;
  quizRestart.hidden = true;
  quizCta.hidden = true;
  if (quizFeedback) quizFeedback.textContent = "Escolha a opção que mais combina com o seu evento.";
  renderQuizQuestion();
});
renderQuizQuestion();

const memoryCards = [...document.querySelectorAll("[data-memory-card]")];
const memoryFeedback = document.querySelector("#memory-feedback");
let openMemoryCards = [];
let matchedPairs = 0;
let memoryLocked = false;
const memoryNames = { audio: "sonorização", light: "iluminação", screen: "painel de LED" };

function resetMemoryGame() {
  openMemoryCards = [];
  matchedPairs = 0;
  memoryLocked = false;
  memoryCards.forEach((card) => {
    card.classList.remove("is-flipped", "is-matched");
    card.setAttribute("aria-label", `Carta, recurso audiovisual virado para baixo`);
    card.disabled = false;
  });
  for (let index = memoryCards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [memoryCards[index], memoryCards[randomIndex]] = [memoryCards[randomIndex], memoryCards[index]];
  }
  memoryCards.forEach((card) => card.parentElement?.append(card));
  if (memoryFeedback) memoryFeedback.textContent = "Encontre os três pares para concluir.";
}

memoryCards.forEach((card) => card.addEventListener("click", () => {
  if (memoryLocked || card.classList.contains("is-matched") || card.classList.contains("is-flipped")) return;
  card.classList.add("is-flipped");
  const cardNumber = [...card.parentElement.children].indexOf(card) + 1;
  card.setAttribute("aria-label", `Carta ${cardNumber}: ${memoryNames[card.dataset.pair]}`);
  openMemoryCards.push(card);
  if (openMemoryCards.length < 2) return;

  const [first, second] = openMemoryCards;
  if (first.dataset.pair === second.dataset.pair) {
    first.classList.replace("is-flipped", "is-matched");
    second.classList.replace("is-flipped", "is-matched");
    first.setAttribute("aria-label", `Par de ${memoryNames[first.dataset.pair]} encontrado`);
    second.setAttribute("aria-label", `Par de ${memoryNames[second.dataset.pair]} encontrado`);
    matchedPairs += 1;
    if (memoryFeedback) memoryFeedback.textContent = matchedPairs === 3
      ? "Parabéns! Som, luz e imagem se conectam em uma experiência. A Brave Bear integra esses recursos para o seu evento."
      : `Par de ${memoryNames[first.dataset.pair]} encontrado! Faltam ${3 - matchedPairs} par${matchedPairs === 2 ? "" : "es"}.`;
    openMemoryCards = [];
    return;
  }

  memoryLocked = true;
  if (memoryFeedback) memoryFeedback.textContent = "Ainda não formou um par. Tente outra combinação.";
  window.setTimeout(() => {
    [first, second].forEach((item) => {
      item.classList.remove("is-flipped");
      const cardIndex = [...item.parentElement.children].indexOf(item) + 1;
      item.setAttribute("aria-label", `Carta ${cardIndex}, recurso audiovisual virado para baixo`);
    });
    openMemoryCards = [];
    memoryLocked = false;
  }, 850);
}));
document.querySelector("#memory-restart")?.addEventListener("click", resetMemoryGame);
resetMemoryGame();

const spinButton = document.querySelector("[data-demo-spin]");
const demoWheel = document.querySelector(".demo-wheel");
const wheelAnnouncement = document.querySelector("#wheel-announcement");
const wheelResult = document.querySelector("#wheel-result");
const wheelResultKicker = document.querySelector("#wheel-result-kicker");
const wheelResultNumber = document.querySelector("#wheel-result-number");
const wheelResultTitle = document.querySelector("#wheel-result-title");
const wheelResultCopy = document.querySelector("#wheel-result-copy");
const wheelResultUse = document.querySelector("#wheel-result-use");
const wheelResultApplications = document.querySelector("#wheel-result-applications");
const wheelCta = document.querySelector("#wheel-cta");
const wheelOptions = [
  { label: "Painel de LED", short: "LED", headline: "Imagem que domina a cena", copy: "Apresentações, lançamentos e identidade visual ganham escala com conteúdo nítido e visível para o público.", applications: "Plenárias · feiras · lançamentos", color: "#087fc6", icon: "<rect x='3' y='4' width='18' height='13' rx='1'/><path d='M9 21h6m-3-4v4'/>" },
  { label: "Sonorização", short: "SOM", headline: "Cada palavra chega com clareza", copy: "Microfones e caixas são planejados para que falas, trilhas e momentos importantes sejam ouvidos com qualidade.", applications: "Palestras · convenções · festas", color: "#075a84", icon: "<path d='M3 9v6h4l7 5V4L7 9H3Z'/><path d='M18 9a5 5 0 0 1 0 6m2-9a9 9 0 0 1 0 12'/>" },
  { label: "Iluminação cênica", short: "LUZ", headline: "O ambiente ganha atmosfera", copy: "Luz cênica e arquitetural valoriza o palco, destaca a marca e ajuda a conduzir o olhar do público.", applications: "Palcos · premiações · ativações", color: "#116c95", icon: "<path d='M8 16a7 7 0 1 1 8 0c-1 1-1.5 2-1.5 3h-5C9.5 18 9 17 8 16Z'/><path d='M10 22h4m-4-3h4'/>" },
  { label: "Interatividade", short: "JOGOS", headline: "O público deixa de apenas assistir", copy: "Quizzes, jogos e experiências digitais convidam as pessoas a participar e criam novas formas de conexão com a marca.", applications: "Feiras · lançamentos · ações de marca", color: "#087b8e", icon: "<path d='M8 12v-1a2 2 0 0 1 4 0v-1a2 2 0 0 1 4 0v1a2 2 0 0 1 4 0v5a5 5 0 0 1-5 5h-3a5 5 0 0 1-4-2l-4-5a2 2 0 0 1 3-2l2 2'/>" },
  { label: "Transmissão ao vivo", short: "AO VIVO", headline: "Seu evento alcança mais pessoas", copy: "Captação, corte e transmissão conectam quem está no local com quem acompanha à distância.", applications: "Eventos híbridos · convenções · palestras", color: "#075993", icon: "<rect x='3' y='7' width='13' height='11' rx='2'/><path d='m16 11 5-3v9l-5-3'/><circle cx='9.5' cy='12.5' r='2.5'/>" },
  { label: "Estrutura de palco", short: "PALCO", headline: "Uma base segura para cada ideia", copy: "Estruturas e suportes organizam os equipamentos e ajudam a transformar o espaço em um cenário funcional.", applications: "Palcos · estandes · apresentações", color: "#123b61", icon: "<path d='M3 5h18M5 5v14m14-14v14M3 19h18M8 5v14m8-14v14M3 10h18m-18 5h18'/>" },
  { label: "Equipe técnica Brave Bear", short: "EQUIPE", headline: "Tecnologia com operação integrada", copy: "Planejamento, montagem e acompanhamento técnico mantêm imagem, som e luz trabalhando em sintonia.", applications: "Do briefing à operação do evento", color: "#0874a7", icon: "<path d='M12 3 14.5 8l5.5.8-4 3.8 1 5.4-5-2.6-5 2.6 1-5.4-4-3.8 5.5-.8L12 3Z'/>" }
];
let spinTimer;
let wheelResultIndex = -1;

function wheelPoint(angle, radius) {
  const radians = angle * Math.PI / 180;
  return { x: 160 + Math.sin(radians) * radius, y: 160 - Math.cos(radians) * radius };
}

function renderWheel() {
  if (!demoWheel) return;
  const radius = 148;
  const segmentAngle = 360 / wheelOptions.length;
  const segments = wheelOptions.map((option, index) => {
    const angle = index * segmentAngle;
    const start = wheelPoint(angle - segmentAngle / 2, radius);
    const end = wheelPoint(angle + segmentAngle / 2, radius);
    const icon = wheelPoint(angle, 84);
    const label = wheelPoint(angle, 119);
    const path = `M160 160 L${start.x.toFixed(2)} ${start.y.toFixed(2)} A${radius} ${radius} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)} Z`;
    const brand = index === wheelOptions.length - 1;
    return `<g class="wheel-slice" data-wheel-slice="${index}"><path class="wheel-slice-bg" d="${path}" fill="${option.color}"/><path class="wheel-slice-line" d="${path}"/><g class="wheel-icon" transform="translate(${(icon.x - 12).toFixed(2)} ${(icon.y - 12).toFixed(2)})"><circle cx="12" cy="12" r="11"/><path d="${option.icon}"/></g><text class="wheel-label${brand ? " wheel-label-brand" : ""}" x="${label.x.toFixed(2)}" y="${(label.y + 3).toFixed(2)}" text-anchor="middle">${option.short}</text></g>`;
  }).join("");
  demoWheel.innerHTML = `<defs><radialGradient id="wheel-center-fill"><stop stop-color="#162e45"/><stop offset="1" stop-color="#06101b"/></radialGradient></defs>${segments}<circle class="wheel-rim" cx="160" cy="160" r="151"/><circle class="wheel-center" cx="160" cy="160" r="33"/><text class="wheel-center-label" x="160" y="158" text-anchor="middle">BRAVE</text><text class="wheel-center-label wheel-center-label-second" x="160" y="171" text-anchor="middle">BEAR</text>`;
}

renderWheel();

function drawWheelResult() {
  const randomValues = new Uint32Array(1);
  if (window.crypto?.getRandomValues) {
    const limit = Math.floor(0x100000000 / wheelOptions.length) * wheelOptions.length;
    do { window.crypto.getRandomValues(randomValues); } while (randomValues[0] >= limit);
    return randomValues[0] % wheelOptions.length;
  }
  return Math.floor(Math.random() * wheelOptions.length);
}

function finishSpin() {
  window.clearTimeout(spinTimer);
  demoWheel?.removeEventListener("animationend", handleSpinEnd);
  demoWheel?.classList.remove("is-spinning");
  if (spinButton) spinButton.disabled = false;
  const option = wheelOptions[wheelResultIndex];
  if (!option) return;
  demoWheel?.querySelectorAll("[data-wheel-slice]").forEach((slice) => slice.classList.toggle("is-winner", Number(slice.dataset.wheelSlice) === wheelResultIndex));
  if (wheelResultKicker) wheelResultKicker.textContent = `SUA IDEIA BRAVE BEAR · ${option.label.toUpperCase()}`;
  if (wheelResultNumber) wheelResultNumber.textContent = String(wheelResultIndex + 1).padStart(2, "0");
  if (wheelResultTitle) wheelResultTitle.textContent = option.headline;
  if (wheelResultCopy) wheelResultCopy.textContent = option.copy;
  if (wheelResultUse) wheelResultUse.hidden = false;
  if (wheelResultApplications) wheelResultApplications.textContent = option.applications;
  if (wheelCta) {
    wheelCta.dataset.selectItem = `${option.label} — origem: roleta audiovisual no site`;
    wheelCta.removeAttribute("aria-disabled");
  }
  if (wheelResult) {
    wheelResult.classList.remove("is-revealed");
    void wheelResult.offsetWidth;
    wheelResult.classList.add("is-revealed");
  }
  if (spinButton) spinButton.innerHTML = `Girar novamente <span aria-hidden="true">↻</span>`;
  if (wheelAnnouncement) wheelAnnouncement.textContent = `Resultado ${wheelResultIndex + 1} de 7: ${option.label}. ${option.headline}. ${option.copy}`;
}
function handleSpinEnd(event) {
  if (event.target === demoWheel) finishSpin();
}
spinButton?.addEventListener("click", () => {
  if (!demoWheel || spinButton.disabled) return;
  spinButton.disabled = true;
  demoWheel.classList.remove("is-spinning");
  demoWheel.querySelectorAll("[data-wheel-slice]").forEach((slice) => slice.classList.remove("is-winner"));
  wheelResult?.classList.remove("is-revealed");
  void demoWheel.offsetWidth;
  if (wheelResultKicker) wheelResultKicker.textContent = "ROLETA EM MOVIMENTO · AGUARDANDO RESULTADO";
  if (wheelResultTitle) wheelResultTitle.textContent = "Uma nova ideia está chegando.";
  if (wheelResultCopy) wheelResultCopy.textContent = "A roleta está escolhendo uma solução audiovisual para inspirar seu próximo evento.";
  if (wheelResultUse) wheelResultUse.hidden = true;
  if (wheelCta) {
    wheelCta.dataset.selectItem = "Ativação digital — origem: roleta audiovisual no site";
    wheelCta.setAttribute("aria-disabled", "true");
  }
  wheelResultIndex = drawWheelResult();
  const segmentAngle = 360 / wheelOptions.length;
  const resultAngle = (360 - wheelResultIndex * segmentAngle + 360) % 360;
  demoWheel.style.setProperty("--spin-angle", `${2160 + resultAngle}deg`);
  demoWheel.classList.add("is-spinning");
  if (wheelAnnouncement) wheelAnnouncement.textContent = "A roleta está girando para revelar uma solução audiovisual.";
  if (spinButton) spinButton.innerHTML = `Revelando solução <span aria-hidden="true">…</span>`;
  demoWheel.addEventListener("animationend", handleSpinEnd);
  spinTimer = window.setTimeout(finishSpin, 3100);
});
