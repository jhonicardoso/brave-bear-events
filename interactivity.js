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

document.querySelectorAll("[data-quiz-choice]").forEach((choice) => choice.addEventListener("click", () => {
  document.querySelectorAll("[data-quiz-choice]").forEach((option) => option.setAttribute("aria-pressed", String(option === choice)));
  const feedback = document.querySelector("#quiz-feedback");
  if (feedback) feedback.textContent = `“${choice.dataset.quizChoice}” selecionado. O conteúdo pode ser personalizado para a marca e para o evento.`;
}));

const memoryCards = [...document.querySelectorAll("[data-memory-card]")];
const memoryFeedback = document.querySelector("#memory-feedback");
let openMemoryCards = [];
let matchedPairs = 0;
let memoryLocked = false;

memoryCards.forEach((card, index) => card.addEventListener("click", () => {
  if (memoryLocked || card.classList.contains("is-matched") || card.classList.contains("is-flipped")) return;
  card.classList.add("is-flipped");
  card.setAttribute("aria-label", `Carta ${index + 1}: ${card.dataset.pair === "led" ? "LED" : "Brave Bear"}`);
  openMemoryCards.push(card);
  if (openMemoryCards.length < 2) return;

  const [first, second] = openMemoryCards;
  if (first.dataset.pair === second.dataset.pair) {
    first.classList.replace("is-flipped", "is-matched");
    second.classList.replace("is-flipped", "is-matched");
    first.setAttribute("aria-label", `Par ${first.dataset.pair === "led" ? "LED" : "Brave Bear"} encontrado`);
    second.setAttribute("aria-label", `Par ${second.dataset.pair === "led" ? "LED" : "Brave Bear"} encontrado`);
    matchedPairs += 1;
    if (memoryFeedback) memoryFeedback.textContent = matchedPairs === 2 ? "Pares encontrados. Demonstração concluída." : "Par encontrado. Encontre o próximo.";
    openMemoryCards = [];
    return;
  }

  memoryLocked = true;
  if (memoryFeedback) memoryFeedback.textContent = "Ainda não formou um par. Tente outra combinação.";
  window.setTimeout(() => {
    [first, second].forEach((item) => {
      item.classList.remove("is-flipped");
      const cardIndex = memoryCards.indexOf(item) + 1;
      item.setAttribute("aria-label", `Carta ${cardIndex}, virada para baixo`);
    });
    openMemoryCards = [];
    memoryLocked = false;
  }, 850);
}));

const spinButton = document.querySelector("[data-demo-spin]");
const demoWheel = document.querySelector(".demo-wheel");
const wheelFeedback = document.querySelector("#wheel-feedback");
let spinTimer;
function finishSpin() {
  window.clearTimeout(spinTimer);
  demoWheel?.removeEventListener("animationend", handleSpinEnd);
  demoWheel?.classList.remove("is-spinning");
  if (spinButton) spinButton.disabled = false;
  if (wheelFeedback) wheelFeedback.textContent = "Demonstração concluída. A dinâmica pode ser definida para o seu projeto.";
}
function handleSpinEnd(event) {
  if (event.target === demoWheel) finishSpin();
}
spinButton?.addEventListener("click", () => {
  if (!demoWheel || spinButton.disabled) return;
  spinButton.disabled = true;
  demoWheel.classList.remove("is-spinning");
  void demoWheel.offsetWidth;
  demoWheel.style.setProperty("--spin-angle", `${1080 + Math.floor(Math.random() * 721)}deg`);
  demoWheel.classList.add("is-spinning");
  if (wheelFeedback) wheelFeedback.textContent = "A roleta está girando…";
  demoWheel.addEventListener("animationend", handleSpinEnd);
  spinTimer = window.setTimeout(finishSpin, 1700);
});
