const { categories = [], products = {} } = window.BRAVE_CATALOG || {};

const ledCalcForm = document.querySelector("#led-calc-form");
const ledCalcMap = document.querySelector("#led-map");
const ledCalcFormat = (value, digits = 0) => new Intl.NumberFormat("pt-BR", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
const ledCalcValue = (name) => Number(ledCalcForm.elements[name].value);
let ledCalcState = null;

function updateLedCalculator() {
  if (!ledCalcForm || !ledCalcMap) return;
  const form = ledCalcForm.elements;
  const preset = form.modulePreset.value;
  const [moduleWidth, moduleHeight] = preset === "custom"
    ? [Number(form.moduleWidth.value), Number(form.moduleHeight.value)]
    : preset.split("x").map(Number);
  const pitch = form.pitch.value === "custom" ? Number(form.customPitch.value) : Number(form.pitch.value);
  const panelWidth = ledCalcValue("width");
  const panelHeight = ledCalcValue("height");
  if (![moduleWidth, moduleHeight, pitch, panelWidth, panelHeight].every((n) => Number.isFinite(n) && n > 0)) return;

  const columns = Math.ceil(panelWidth / moduleWidth);
  const rows = Math.ceil(panelHeight / moduleHeight);
  const tiles = columns * rows;
  const modulePixelsWide = Math.max(1, Math.round(moduleWidth * 1000 / pitch));
  const modulePixelsHigh = Math.max(1, Math.round(moduleHeight * 1000 / pitch));
  const resolutionWidth = columns * modulePixelsWide;
  const resolutionHeight = rows * modulePixelsHigh;
  const builtWidth = columns * moduleWidth;
  const builtHeight = rows * moduleHeight;
  const area = builtWidth * builtHeight;
  const weightEach = Number(form.weight.value) > 0 ? Number(form.weight.value) : (preset === "0.5x0.5" ? 7.5 : preset === "0.5x1" ? 14 : 30 * moduleWidth * moduleHeight);
  const weight = weightEach * tiles;
  const caseCapacity = Math.max(1, ledCalcValue("caseCapacity"));
  const pixelsPerPort = Math.max(1, ledCalcValue("pixelsPerPort"));
  const usablePixels = pixelsPerPort * (1 - ledCalcValue("signalMargin") / 100);
  const signalCascade = Math.max(1, ledCalcValue("signalCascade"));
  const perPort = Math.max(1, Math.min(signalCascade, Math.floor(usablePixels / (modulePixelsWide * modulePixelsHigh))));
  const signalGroups = Math.ceil(tiles / perPort);
  const wattsPerSqm = Math.max(1, ledCalcValue("wattsPerSqm"));
  const power = area * wattsPerSqm;
  const voltage = ledCalcValue("voltage");
  const amps = Math.max(1, ledCalcValue("amps"));
  const circuitUse = ledCalcValue("circuitUse") / 100;
  const acCascade = Math.max(1, ledCalcValue("acCascade"));
  const wattsPerTile = area > 0 ? power / tiles : 0;
  const powerPerCircuit = voltage * amps * circuitUse;
  const tilesPerAcCircuit = Math.max(1, Math.min(acCascade, Math.floor(powerPerCircuit / wattsPerTile)));
  const acGroups = Math.ceil(tiles / tilesPerAcCircuit);
  const estimatedKva = power / 1000 / 0.9;
  const distanceMin = pitch / 1000;
  const distanceMax = pitch * 3 / 1000;

  ledCalcState = { rows, columns, tiles, modulePixelsWide, modulePixelsHigh, resolutionWidth, resolutionHeight, builtWidth, builtHeight, area, weightEach, weight, caseCapacity, perPort, signalGroups, power, estimatedKva, acGroups, tilesPerAcCircuit, distanceMin, distanceMax };
  const results = {
    tiles: `${ledCalcFormat(tiles)} placas`,
    resolution: `${ledCalcFormat(resolutionWidth)} × ${ledCalcFormat(resolutionHeight)} px`,
    area: `${ledCalcFormat(area, 2)} m² (${ledCalcFormat(builtWidth, 2)} × ${ledCalcFormat(builtHeight, 2)} m)`,
    cases: `${ledCalcFormat(Math.ceil(tiles / caseCapacity))} (${ledCalcFormat(caseCapacity)} por case)`,
    weight: `${ledCalcFormat(weight, 1)} kg (${ledCalcFormat(weightEach, 1)} kg/placa)`,
    distance: `${ledCalcFormat(distanceMin, 1)}–${ledCalcFormat(distanceMax, 1)} m`,
    perPort: `${ledCalcFormat(perPort)} (${ledCalcFormat(Math.ceil(modulePixelsWide * modulePixelsHigh))} px/placa)`,
    signalCables: `${ledCalcFormat(signalGroups)} circuitos / ${ledCalcFormat(tiles - signalGroups)} jumpers`,
    power: `${ledCalcFormat(power)} W · ${ledCalcFormat(estimatedKva, 2)} kVA*`,
    acCircuits: `${ledCalcFormat(acGroups)} circuitos / ${ledCalcFormat(tiles - acGroups)} jumpers`
  };
  Object.entries(results).forEach(([key, value]) => {
    const output = document.querySelector(`[data-result="${key}"]`);
    if (output) output.textContent = value;
  });
  const summary = document.querySelector('[data-result="mapSummary"]');
  if (summary) summary.textContent = `${rows} linhas × ${columns} colunas · ${builtWidth.toFixed(2)} × ${builtHeight.toFixed(2)} m`;
  drawLedMap();
}

function drawLedMap() {
  const state = ledCalcState;
  if (!state || !ledCalcMap) return;
  const maxVisibleTiles = 1200;
  if (state.tiles > maxVisibleTiles) {
    ledCalcMap.replaceChildren();
    ledCalcMap.style.gridTemplateColumns = "1fr";
    const message = document.createElement("p");
    message.className = "led-map-download-note";
    message.textContent = `O mapa detalhado tem ${ledCalcFormat(state.tiles)} placas. Reduza as dimensões para visualizar o mapa na página.`;
    ledCalcMap.append(message);
    return;
  }
  ledCalcMap.style.gridTemplateColumns = `repeat(${state.columns}, 56px)`;
  const fragment = document.createDocumentFragment();
  for (let row = 0; row < state.rows; row += 1) {
    const leftToRight = row % 2 === 0;
    for (let step = 0; step < state.columns; step += 1) {
      const column = leftToRight ? step : state.columns - 1 - step;
      const index = row * state.columns + step;
      const signalCircuit = Math.floor(index / state.perPort) + 1;
      const acCircuit = Math.floor(index / state.tilesPerAcCircuit) + 1;
      const tile = document.createElement("div");
      tile.className = "led-map-tile";
      tile.title = `Placa ${index + 1}, linha ${row + 1}, coluna ${column + 1}, sinal S${signalCircuit}, AC${acCircuit}`;
      const position = document.createElement("span");
      position.textContent = `${leftToRight ? "→" : "←"} L${row + 1} C${column + 1}`;
      const label = document.createElement("strong");
      label.textContent = `P${index + 1}`;
      const circuits = document.createElement("small");
      circuits.textContent = `S${signalCircuit} · AC${acCircuit}`;
      tile.append(position, label, circuits);
      fragment.append(tile);
    }
  }
  ledCalcMap.replaceChildren(fragment);
}

if (ledCalcForm) {
  ledCalcForm.addEventListener("input", updateLedCalculator);
  ledCalcForm.addEventListener("change", (event) => {
    const showModule = ledCalcForm.elements.modulePreset.value === "custom";
    ledCalcForm.querySelectorAll(".custom-module-field").forEach((field) => { field.hidden = !showModule; });
    ledCalcForm.querySelector(".custom-pitch-field").hidden = ledCalcForm.elements.pitch.value !== "custom";
    updateLedCalculator();
  });
  const mapDownload = document.querySelector("#led-map-download");
  mapDownload?.addEventListener("click", () => {
    if (!ledCalcState) return;
    const state = ledCalcState;
    const lines = ["Pixel Map — Brave Bear Events", `Dimensões: ${state.builtWidth.toFixed(2)} × ${state.builtHeight.toFixed(2)} m`, `Resolução: ${state.resolutionWidth} × ${state.resolutionHeight} px`, `Placas: ${state.tiles}`, `Peso estimado: ${state.weight.toFixed(1)} kg`, `Circuitos de sinal estimados: ${state.signalGroups}`, `Circuitos AC estimados: ${state.acGroups}`, "", "Placa;Linha;Coluna;Circuito sinal;Circuito AC"];
    for (let row = 0; row < state.rows; row += 1) {
      for (let step = 0; step < state.columns; step += 1) {
        const column = row % 2 === 0 ? step : state.columns - 1 - step;
        const index = row * state.columns + step;
        lines.push(`${index + 1};${row + 1};${column + 1};S${Math.floor(index / state.perPort) + 1};AC${Math.floor(index / state.tilesPerAcCircuit) + 1}`);
      }
    }
    const blob = new Blob(["\ufeff", lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "brave-bear-pixel-map.csv";
    link.click();
    URL.revokeObjectURL(url);
  });
  updateLedCalculator();
}

const categoryGrid = document.querySelector("#equipment-categories");
const categoryTabs = document.querySelector("#category-tabs");
const productList = document.querySelector("#product-list");
const catalogPanel = document.querySelector("#catalog-panel");
const currentTitle = document.querySelector("#catalog-current-title");
const currentSubtitle = document.querySelector("#catalog-current-subtitle");
const searchInput = document.querySelector("#equipment-search");
const selectedItemInput = document.querySelector("#selected-item");
const selectedKitItemsInput = document.querySelector("#selected-kit-items");
const selectedKitSummary = document.querySelector("#selected-kit-summary");
const catalogTransition = document.querySelector("#catalog-transition");
const catalogTransitionTitle = document.querySelector("#catalog-transition-title");
const requestedCategory = new URLSearchParams(window.location.search).get("categoria");
let activeCategory = categories.some(({ id }) => id === requestedCategory) ? requestedCategory : "led";

function renderCategories() {
  if (!categoryGrid) return;
  categoryGrid.innerHTML = categories.map((category) => `
    <button class="equipment-feature" type="button" data-category="${category.id}" aria-pressed="${category.id === activeCategory}" style="--card-image: url('${category.image}')">
      <small>${category.count}</small><strong>${category.short}</strong><em>Ver itens <span aria-hidden="true">↘</span></em>
    </button>`).join("");
  categoryTabs.innerHTML = categories.map((category) => `
    <button class="category-tab" id="tab-${category.id}" type="button" role="tab" data-category="${category.id}" aria-selected="${category.id === activeCategory}" aria-controls="product-list">${category.label}</button>`).join("");
}

function renderProducts() {
  if (!productList || !searchInput) return;
  const category = categories.find(({ id }) => id === activeCategory);
  const query = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  const matches = (products[activeCategory] || []).map(([name, detail], index) => ({ name, detail, index }))
    .filter(({ name, detail }) => `${name} ${detail}`.toLocaleLowerCase("pt-BR").includes(query));
  currentTitle.textContent = category.label;
  currentSubtitle.textContent = category.tagline;
  categoryTabs.querySelectorAll("[role='tab']").forEach((tab) => {
    const selected = tab.dataset.category === activeCategory;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  categoryGrid.querySelectorAll("[data-category]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.category === activeCategory));
  });
  if (!matches.length) {
    productList.innerHTML = '<p class="product-empty">Nenhum equipamento encontrado nesta categoria.</p>';
    return;
  }
  productList.innerHTML = matches.map(({ name, detail, index }) => {
    let image;
    if (activeCategory === "led" && index >= 9) {
      const cubeStyles = ["cubo-no-piso", "cubo-empilhado", "cubo-suspenso"];
      image = `assets/cubos/${cubeStyles[index - 9]}-desktop.jpg`;
    } else {
      const photoIndex = activeCategory === "interactive"
        ? [1, 2, 3, 3, 3, 3, 3, 3, 4, 5][index]
        : activeCategory === "led"
          ? [1, 2, 3, 4, 5, 6, 7, 9, 8][index]
          : index + 1;
      image = `assets/catalog-items/${activeCategory}-${String(photoIndex).padStart(2, "0")}.webp`;
    }
    return `<article class="product-card">
      <img class="product-image" src="${image}" alt="${name}" loading="lazy" width="640" height="420">
      <span class="product-text"><strong>${name}</strong><small>${detail || category.label}</small></span>
      <button type="button" data-select-item="${name}" aria-label="Solicitar orçamento para ${name}">↗</button>
    </article>`;
  }).join("");
}

function chooseCategory(categoryId, scrollToList = false) {
  if (!categories.some(({ id }) => id === categoryId)) return;
  activeCategory = categoryId;
  if (searchInput) searchInput.value = "";
  renderProducts();
  if (scrollToList) catalogPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showCategory(categoryId) {
  const category = categories.find(({ id }) => id === categoryId);
  if (!category) return;
  if (!catalogTransition || !catalogTransitionTitle || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    chooseCategory(categoryId, true);
    return;
  }
  catalogTransitionTitle.textContent = category.label;
  catalogTransition.style.setProperty("--transition-image", `url('${category.image}')`);
  catalogTransition.setAttribute("aria-hidden", "false");
  catalogTransition.classList.add("is-active");
  document.body.classList.add("catalog-transitioning");
  window.setTimeout(() => {
    chooseCategory(categoryId, true);
    catalogTransition.classList.remove("is-active");
    catalogTransition.setAttribute("aria-hidden", "true");
    document.body.classList.remove("catalog-transitioning");
  }, 560);
}

renderCategories();
renderProducts();
categoryGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (button) showCategory(button.dataset.category);
});
categoryTabs?.addEventListener("click", (event) => {
  const tab = event.target.closest("[role='tab']");
  if (tab) chooseCategory(tab.dataset.category);
});
categoryTabs?.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  const tabs = [...categoryTabs.querySelectorAll("[role='tab']")];
  const index = tabs.indexOf(document.activeElement);
  if (index < 0) return;
  event.preventDefault();
  const next = (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
  tabs[next].focus();
  chooseCategory(tabs[next].dataset.category);
});
searchInput?.addEventListener("input", renderProducts);

function setRequestedItem(item) {
  if (!selectedItemInput) return;
  selectedItemInput.value = item;
  document.querySelector("#orcamento")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const eventExperienceDetails = [
  { title: "Eventos corporativos", formType: "Evento corporativo", image: "assets/event-types/01-eventos-corporativos.jpg", copy: "A Brave Bear planeja a estrutura audiovisual para encontros corporativos de diferentes formatos, integrando painéis de LED, TVs, sonorização, iluminação e estruturas conforme o espaço e a proposta do evento." },
  { title: "Congressos", formType: "Congresso ou convenção", image: "assets/event-types/02-congressos.jpg", copy: "Para congressos, a Brave Bear combina painéis de LED, TVs, sonorização, iluminação e processamento de vídeo para apoiar plenárias, apresentações e debates com comunicação clara para o público." },
  { title: "Convenções", formType: "Congresso ou convenção", image: "assets/event-types/03-convencoes.jpg", copy: "A Brave Bear reúne painéis de LED, processamento e controle, sonorização, iluminação e estruturas para dar unidade visual e sonora a convenções de diferentes portes." },
  { title: "Palestras", formType: "Palestra ou treinamento", image: "assets/event-types/04-palestras.jpg", copy: "A Brave Bear oferece sonorização, painéis de LED ou TVs, iluminação e processamento de vídeo para valorizar a apresentação e manter conteúdo e palestrante em evidência." },
  { title: "Workshops", formType: "Palestra ou treinamento", image: "assets/event-types/05-workshops.jpg", copy: "Em workshops, a Brave Bear integra TVs, painéis de LED e recursos de interatividade a soluções de sonorização e iluminação adequadas ao espaço, apoiando encontros práticos e participativos." },
  { title: "Treinamentos", formType: "Palestra ou treinamento", image: "assets/event-types/06-treinamentos.jpg", copy: "A Brave Bear dimensiona TVs ou painéis de LED, processamento e controle, além de sonorização, para apoiar apresentações e atividades de capacitação em diferentes ambientes." },
  { title: "Feiras", formType: "Feira ou exposição", image: "assets/event-types/07-feiras.jpg", copy: "A Brave Bear fornece painéis de LED, TVs, estruturas e iluminação para destacar estandes e apresentar conteúdos com visibilidade em pavilhões de feira." },
  { title: "Exposições", formType: "Feira ou exposição", image: "assets/event-types/08-exposicoes.jpg", copy: "Para exposições, a Brave Bear combina painéis de LED, televisores, iluminação e recursos de interatividade na criação de ambientes audiovisuais alinhados à proposta de cada espaço." },
  { title: "Lançamentos", formType: "Lançamento ou premiação", image: "assets/event-types/09-lancamentos.jpg", copy: "A Brave Bear combina painéis de LED, processamento de vídeo, sonorização, iluminação e estruturas para valorizar a apresentação de produtos e novidades." },
  { title: "Premiações", formType: "Lançamento ou premiação", image: "assets/event-types/10-premiacoes.jpg", copy: "A Brave Bear reúne painéis de LED, sonorização, iluminação e estruturas para apoiar os momentos de palco e dar destaque visual à cerimônia de premiação." },
  { title: "Eventos sociais", formType: "Evento social", image: "assets/event-types/11-eventos-sociais.jpg", copy: "Em eventos sociais, a Brave Bear oferece sonorização, iluminação, painéis de LED e estruturas para compor uma experiência audiovisual de acordo com o estilo da celebração." },
  { title: "Ativações de marca", formType: "Ativação de marca", image: "assets/event-types/12-ativacoes-de-marca.jpg", copy: "A Brave Bear apoia ativações de marca com painéis de LED, TVs, interatividade, sonorização e iluminação, integrando recursos audiovisuais à experiência proposta." }
];
const eventDialog = document.querySelector("#event-dialog");
const eventDialogTitle = document.querySelector("#event-dialog-title");
const eventDialogCopy = document.querySelector("#event-dialog-copy");
const eventDialogImage = document.querySelector("#event-dialog-image");
const eventTypeSelect = document.querySelector("#quote-form [name='eventType']");
document.querySelectorAll("[data-event-detail]").forEach((button) => button.addEventListener("click", () => {
  const index = Number(button.dataset.eventDetail);
  const detail = eventExperienceDetails[index];
  if (!detail || !eventDialog) return;
  eventDialog.dataset.eventIndex = String(index);
  eventDialogTitle.textContent = detail.title;
  eventDialogCopy.textContent = detail.copy;
  eventDialogImage.src = detail.image;
  eventDialogImage.alt = `Imagem ilustrativa: ${detail.title}`;
  eventDialog.showModal();
}));
document.querySelector(".event-dialog-close")?.addEventListener("click", () => eventDialog?.close());
eventDialog?.addEventListener("click", (event) => {
  if (event.target === eventDialog) eventDialog.close();
});
document.querySelector("#event-dialog-quote")?.addEventListener("click", () => {
  const detail = eventExperienceDetails[Number(eventDialog?.dataset.eventIndex)];
  if (detail && eventTypeSelect) eventTypeSelect.value = detail.formType;
  eventDialog?.close();
});

document.addEventListener("click", (event) => {
  const kitCard = event.target.closest(".kit-card");
  if (kitCard) {
    kitCard.classList.remove("is-clicked");
    void kitCard.offsetWidth;
    kitCard.classList.add("is-clicked");
    window.setTimeout(() => kitCard.classList.remove("is-clicked"), 520);
  }

  const productButton = event.target.closest("[data-select-item]");
  if (productButton) {
    setRequestedItem(productButton.dataset.selectItem);
    return;
  }
  const kitLink = event.target.closest("[data-kit]");
  if (kitLink) {
    selectedItemInput.value = kitLink.dataset.kit;
    const kitItems = kitLink.dataset.kitItems || "";
    if (selectedKitItemsInput) selectedKitItemsInput.value = kitItems;
    if (selectedKitSummary) {
      selectedKitSummary.textContent = `${kitLink.dataset.kit} selecionado. Itens: ${kitItems}. Essa seleção será incluída na mensagem do seu orçamento.`;
      selectedKitSummary.hidden = false;
    }
    document.querySelector("#orcamento").scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");
function closeMenu() {
  if (!menuButton || !mainNav) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
  mainNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}
menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  mainNav?.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
});
mainNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });

document.querySelector("#quote-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const delivery = event.submitter?.value || "whatsapp";
  const values = new FormData(form);
  const solutions = values.getAll("solutions");
  const lines = [
    "Olá, Brave Bear! Gostaria de solicitar um orçamento.",
    "",
    `Nome: ${values.get("name")}`,
    values.get("company") ? `Empresa: ${values.get("company")}` : "",
    `E-mail: ${values.get("email")}`,
    values.get("phone") ? `WhatsApp: ${values.get("phone")}` : "",
    values.get("eventType") ? `Tipo de evento: ${values.get("eventType")}` : "",
    values.get("date") ? `Data: ${values.get("date")}` : "",
    values.get("location") ? `Local: ${values.get("location")}` : "",
    values.get("participants") ? `Participantes: ${values.get("participants")}` : "",
    solutions.length ? `Soluções desejadas: ${solutions.join(", ")}` : "",
    values.get("selectedItem") ? `Interesse específico: ${values.get("selectedItem")}` : "",
    values.get("selectedKitItems") ? `Itens do kit selecionado: ${values.get("selectedKitItems")}` : "",
    values.get("description") ? `Descrição: ${values.get("description")}` : ""
  ].filter(Boolean);
  const feedback = document.querySelector("#form-feedback");
  const message = lines.join("\n");
  const isEmail = delivery === "email";
  const destination = isEmail
    ? `mailto:comercial@bravebear.com.br?subject=${encodeURIComponent(`Solicitação de orçamento - ${values.get("name")}`)}&body=${encodeURIComponent(message)}`
    : `https://wa.me/5511911728323?text=${encodeURIComponent(message)}`;
  const linkLabel = isEmail ? "Abrir e-mail" : "Abrir conversa no WhatsApp";
  const feedbackMessage = isEmail
    ? "Seu aplicativo de e-mail deve abrir com a solicitação preenchida. Revise e envie a mensagem."
    : "Sua solicitação está pronta no WhatsApp. Revise e envie a mensagem.";
  feedback.innerHTML = `${feedbackMessage} <a href="${destination}"${isEmail ? "" : ' target="_blank" rel="noopener noreferrer"'}>${linkLabel}</a>`;
  if (isEmail) {
    window.location.href = destination;
  } else {
    const newTab = window.open(destination, "_blank");
    if (newTab) newTab.opener = null;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "quote_request_prepared", source: "website", method: delivery });
  if (typeof window.gtag === "function") window.gtag("event", "generate_lead", { method: delivery });
  if (typeof window.fbq === "function") window.fbq("track", "Lead");
});

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

const clientCarousel = document.querySelector(".client-carousel");
const clientTrack = clientCarousel?.querySelector(".client-track");
const clientList = clientTrack?.querySelector(".client-list");
const clientCarouselToggle = clientCarousel?.querySelector(".client-carousel-toggle");
if (clientCarousel && clientTrack && clientList && clientCarouselToggle) {
  const duplicateList = clientList.cloneNode(true);
  duplicateList.setAttribute("aria-hidden", "true");
  duplicateList.querySelectorAll("img").forEach((logo) => logo.setAttribute("alt", ""));
  clientTrack.append(duplicateList);
  clientTrack.classList.add("is-ready");
  clientCarousel.classList.add("has-controls");

  clientCarouselToggle.addEventListener("click", () => {
    const isPaused = clientTrack.classList.toggle("is-paused");
    clientCarouselToggle.setAttribute("aria-pressed", String(isPaused));
    clientCarouselToggle.setAttribute("aria-label", isPaused ? "Retomar a rolagem automática das logos" : "Pausar a rolagem automática das logos");
    clientCarouselToggle.textContent = isPaused ? "Retomar" : "Pausar";
  });
}

const revealTargets = document.querySelectorAll(".service-card, .kit-card, .equipment-feature, .process-list li, .client-carousel, .quote-form");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -25px 0px" });
  revealTargets.forEach((element) => {
    element.classList.add("reveal-pending");
    revealObserver.observe(element);
  });
}

const heroPhoto = document.querySelector(".hero-photo");
if (heroPhoto && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      const shift = -Math.min(window.scrollY * 0.07, 54);
      heroPhoto.style.setProperty("--hero-parallax", `${shift}px`);
      ticking = false;
    });
  }, { passive: true });
}
