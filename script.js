const categories = [
  { id: "led", label: "Painel de LED", short: "Painel de LED", count: "9 opções", tagline: "Imagem que cria grandes experiências.", image: "assets/led.webp", symbol: "▦" },
  { id: "interactive", label: "Interatividade", short: "Interatividade", count: "11 soluções", tagline: "Tecnologia que conecta pessoas e experiências.", image: "assets/interactive.webp", symbol: "⌁" },
  { id: "televisions", label: "Televisores", short: "Televisores", count: "8 opções", tagline: "Imagens impactantes com qualidade para o seu evento.", image: "assets/televisions.webp", symbol: "▣" },
  { id: "projection", label: "Projeção", short: "Projeção", count: "11 opções", tagline: "Soluções de projeção para impactar o público.", image: "assets/projection.webp", symbol: "▱" },
  { id: "processing", label: "Processamento e controle de LED", short: "Controle de LED", count: "12 opções", tagline: "Processamento e operação de painéis de LED.", image: "assets/processing.webp", symbol: "⌘" },
  { id: "audio", label: "Sonorização", short: "Sonorização", count: "15 opções", tagline: "Som de alta qualidade para diferentes formatos de evento.", image: "assets/audio.webp", symbol: "◖))" },
  { id: "lighting", label: "Iluminação", short: "Iluminação", count: "35 opções", tagline: "Luz para valorizar cada detalhe do evento.", image: "assets/lighting.webp", symbol: "✳" },
  { id: "structure", label: "Estrutura", short: "Estrutura", count: "9 opções", tagline: "Estrutura para dar suporte às ideias do seu evento.", image: "assets/structure.webp", symbol: "⌗" }
];

const products = {
  led: [
    ["LED P1.9MM Indoor", "Placa 50 × 50"],
    ["LED P2.9MM Flexível Indoor", "Placa 50 × 50"],
    ["LED P2.9MM Canto Vivo Indoor", "Placa 50 × 50"],
    ["LED P2.9MM Flexível Canto Vivo", "Placa 50 × 50"],
    ["LED P3.9MM Canto Vivo Outdoor", "Placa 50 × 50"],
    ["LED P2.9MM Indoor Curvo", "Placa 50 × 50"],
    ["LED P3.9MM Outdoor / Indoor", "Placa 50 × 50"],
    ["Piso de LED P3.9MM Indoor", "Indoor"],
    ["Totem de LED P1.8", "0,65 × 2 m · Resolução 344 × 1032"]
  ],
  interactive: [
    ["Totem de LED P1.8", "0,65 × 2 m · Resolução 344 × 1032"],
    ["Totem interativo com tablet", ""],
    ["Totem interativo 43″", ""],
    ["Totem interativo 55″", ""],
    ["Totem interativo 65″", ""],
    ["Totem interativo 75″", ""],
    ["Totem interativo 85″", ""],
    ["Totem interativo vertical", ""],
    ["Totem interativo horizontal", ""],
    ["Tablet", "Dispositivo para experiências e interações personalizadas"],
    ["iPad", "Dispositivo para experiências e interações personalizadas"]
  ],
  televisions: [
    ["TV 85″", ""], ["TV 75″", ""], ["TV 65″", ""], ["TV 55″", ""], ["TV 43″", ""],
    ["Dog House 43″ a 55″", ""], ["Dog House fechada", ""], ["Pedestal 43″ a 85″", ""]
  ],
  projection: [
    ["Projetor 3.000–4.000 ANSI", ""], ["Projetor 5.000–6.000 ANSI", ""],
    ["Projetor 8.000–10.000 ANSI", ""], ["Projetor de alta luminosidade", ""],
    ["Tela de projeção", "Diversos formatos"], ["Tela tripé", ""], ["Tela tensionada", ""],
    ["Tela frontal / traseira", ""], ["Projetor + lente de longo alcance", ""],
    ["Switcher para projeção", ""], ["Processadores / scalers", ""]
  ],
  processing: [
    ["Máquina de gerenciamento", ""], ["Processadora H2", ""], ["Processadora 4K", ""],
    ["Processadora VX1000", ""], ["Processadora 605S / 660", ""], ["Send Card 600", ""],
    ["Send Card 300", ""], ["Notebook Gamer", ""], ["Notebook i5–i7", ""],
    ["Cue Light", ""], ["Fibra Óptica HDMI 100M", ""], ["Main Power 5 KVA", ""]
  ],
  audio: [
    ["Mesa TF5", "32 canais"], ["Mesa iX32 Compact", "24 canais"],
    ["Mesa QSC TouchMix", "32 canais"], ["Mesa QSC TouchMix", "16 canais"],
    ["Mesa Arcano", "12 canais"], ["Mesa Promixer", "8 canais"],
    ["Mic bastão Sennheiser G3 / G4 / G5", ""],
    ["Mic headset Madonna / Countryman Sennheiser G4 / G5", ""],
    ["Mic headset lapela Sennheiser G4 / G5", ""],
    ["Rack microfone Sennheiser G5 EW-D 835-S", ""],
    ["Amplificador de antena", ""], ["Placa de áudio", ""],
    ["Caixa QSC KC12 Torre", ""], ["Caixa QSC K12.2 / K10.2", ""], ["Sub QSC KW181", ""]
  ],
  lighting: [
    ["Par LED Slim 3W", ""], ["Par LED Slim 12W", ""], ["Par LED Indoor 18W RGBW", ""],
    ["Par LED 15W RGBWA-UV", ""], ["Par LED Blindada 18W RGBW", ""], ["Par LED Bateria RGBWA-UV", ""],
    ["LED P5", ""], ["Ribalta RGBW 8W", ""], ["Ribalta RGBW 12W", ""], ["Ribalta Blindada RGBW 30W", ""],
    ["Strobo LED RGBW 1000W", ""], ["Fresnel 1000W", ""], ["Fresnel 2000W", ""],
    ["Fresnel LED 200W", ""], ["Vara de Pimbim LED e Quente", ""], ["Mini Brut LED", ""],
    ["Elipsoidal ETC 575W / 750W", ""], ["Elipsoidal LED AB 200W", ""], ["Canhão Seguidor 7R", ""],
    ["Moving Wash 320W", ""], ["Moving Beam 14R 295W com borda LED", ""],
    ["Moving Beam 17R 350W", ""], ["Moving Beam 7R 230W", ""], ["Moving Spot LED 150W", ""],
    ["Sky Light 4000W", ""], ["Sky Paper", ""], ["Rack Buffer", ""],
    ["Máquina de Fumaça 1500W", ""], ["Máquina de Fumaça 3000W", ""], ["Máquina de Haze", ""],
    ["Mesa DMX Operator 512", ""], ["Mesa Grand MA2", ""], ["Mesa Avolite 2010", ""], ["Mesa 1024", ""], ["Mesa Kingkong", ""]
  ],
  structure: [
    ["Box Truss Q15", ""], ["Box Truss Q25", ""], ["Box Truss Q30", ""],
    ["Sleeve", "Acessório de truss"], ["Pau de carga", "Acessório de truss"],
    ["AlumaLock", "Acessório de truss"], ["Talhas", "Acessório de truss"],
    ["Bases", "Acessório de truss"], ["Passa cabo", "Segurança e organização"]
  ]
};

const categoryGrid = document.querySelector("#equipment-categories");
const categoryTabs = document.querySelector("#category-tabs");
const productList = document.querySelector("#product-list");
const currentTitle = document.querySelector("#catalog-current-title");
const currentSubtitle = document.querySelector("#catalog-current-subtitle");
const searchInput = document.querySelector("#equipment-search");
const selectedItemInput = document.querySelector("#selected-item");
let activeCategory = "led";

function renderCategories() {
  categoryGrid.innerHTML = categories.map((category) => `
    <button class="equipment-feature" type="button" data-category="${category.id}" aria-pressed="${category.id === activeCategory}" style="--card-image: url('${category.image}')">
      <small>${category.count}</small><strong>${category.short}</strong><em>Explorar categoria <span aria-hidden="true">↗</span></em>
    </button>`).join("");

  categoryTabs.innerHTML = categories.map((category) => `
    <button class="category-tab" id="tab-${category.id}" type="button" role="tab" data-category="${category.id}" aria-selected="${category.id === activeCategory}" aria-controls="product-list">${category.label}</button>`).join("");
}

function renderProducts() {
  const category = categories.find((item) => item.id === activeCategory);
  const query = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  const filtered = (products[activeCategory] || []).filter(([name, detail]) => `${name} ${detail}`.toLocaleLowerCase("pt-BR").includes(query));
  currentTitle.textContent = category.label;
  currentSubtitle.textContent = category.tagline;
  categoryTabs.querySelectorAll("[role='tab']").forEach((button) => {
    const selected = button.dataset.category === activeCategory;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  categoryGrid.querySelectorAll("[data-category]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.category === activeCategory));
  });

  if (!filtered.length) {
    productList.innerHTML = '<p class="product-empty">Nenhum equipamento encontrado nesta categoria.</p>';
    return;
  }

  const expansion = activeCategory === "structure" && !query ? `
    <aside class="future-catalog"><small>ESPAÇO PARA EXPANSÃO DO CATÁLOGO</small><p>Categorias previstas para cadastro futuro:</p><span>Palcos</span><span>Praticáveis</span><span>Escadas</span><span>Guarda-corpo</span><span>Coberturas</span><span>Backdrops</span><span>Pórticos</span><span>Torres</span><span>Ground Support</span><span>Suportes para LED</span><span>Suportes para iluminação</span></aside>` : "";
  productList.innerHTML = filtered.map(([name, detail]) => `
    <article class="product-card">
      <span class="product-mark" aria-hidden="true">${category.symbol}</span>
      <span class="product-text"><strong>${name}</strong><small>${detail || category.label}</small></span>
      <button type="button" data-select-item="${name}" aria-label="Solicitar orçamento para ${name}">↗</button>
    </article>`).join("") + expansion;
}

function chooseCategory(categoryId) {
  if (!categories.some((category) => category.id === categoryId)) return;
  activeCategory = categoryId;
  if (searchInput) searchInput.value = "";
  renderProducts();
}

renderCategories();
renderProducts();

categoryGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (button) chooseCategory(button.dataset.category);
});
categoryTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (button) chooseCategory(button.dataset.category);
});
categoryTabs.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  const tabs = [...categoryTabs.querySelectorAll("[role='tab']")];
  const index = tabs.indexOf(document.activeElement);
  if (index < 0) return;
  event.preventDefault();
  const next = (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
  tabs[next].focus();
  chooseCategory(tabs[next].dataset.category);
});
searchInput.addEventListener("input", renderProducts);

function setRequestedItem(item) {
  selectedItemInput.value = item;
  document.querySelector("#orcamento").scrollIntoView({ behavior: "smooth", block: "start" });
}

document.addEventListener("click", (event) => {
  const productButton = event.target.closest("[data-select-item]");
  if (productButton) {
    setRequestedItem(productButton.dataset.selectItem);
    return;
  }
  const categoryLink = event.target.closest("[data-category-link]");
  if (categoryLink) chooseCategory(categoryLink.dataset.categoryLink);

  const kitLink = event.target.closest("[data-kit]");
  if (kitLink) {
    selectedItemInput.value = kitLink.dataset.kit;
    document.querySelector("#orcamento").scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");
function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
  mainNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  mainNav.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
});
mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });

document.querySelector("#quote-form").addEventListener("submit", (event) => {
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

document.querySelector("#current-year").textContent = String(new Date().getFullYear());

const clientCarousel = document.querySelector(".client-carousel");
const clientTrack = clientCarousel?.querySelector(".client-track");
const clientList = clientTrack?.querySelector(".client-list");
const clientCarouselToggle = clientCarousel?.querySelector(".client-carousel-toggle");
if (clientCarousel && clientTrack && clientList && clientCarouselToggle && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
