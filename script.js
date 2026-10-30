const { categories = [] } = window.BRAVE_CATALOG || {};

const categoryGrid = document.querySelector("#equipment-categories");
const selectedItemInput = document.querySelector("#selected-item");
const selectedKitItemsInput = document.querySelector("#selected-kit-items");
const selectedKitSummary = document.querySelector("#selected-kit-summary");
const catalogTransition = document.querySelector("#catalog-transition");
const catalogTransitionTitle = document.querySelector(
  "#catalog-transition-title",
);

function renderCategories() {
  if (!categoryGrid) return;
  categoryGrid.innerHTML = categories
    .map(
      (category) => `
    <a class="equipment-feature" href="equipamentos.html?categoria=${encodeURIComponent(category.id)}" data-category="${category.id}" aria-label="Ver produtos de ${category.short} (${category.count})" style="--card-image: url('${category.image}')">
      <small>${category.count}</small><strong>${category.short}</strong><em>Ver itens <span aria-hidden="true">↘</span></em>
    </a>`,
    )
    .join("");
}

renderCategories();
categoryGrid?.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-category]");
  if (
    !link ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  const category = categories.find(({ id }) => id === link.dataset.category);
  if (
    !category ||
    !catalogTransition ||
    !catalogTransitionTitle ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  event.preventDefault();
  catalogTransitionTitle.textContent = category.label;
  catalogTransition.style.setProperty(
    "--transition-image",
    `url('${category.image}')`,
  );
  catalogTransition.setAttribute("aria-hidden", "false");
  catalogTransition.classList.add("is-active");
  document.body.classList.add("catalog-transitioning");
  window.setTimeout(() => {
    window.location.href = link.href;
  }, 560);
});

function setRequestedItem(item) {
  if (!selectedItemInput) return;
  selectedItemInput.value = item;
  document
    .querySelector("#orcamento")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const eventExperienceDetails = [
  {
    title: "Eventos corporativos",
    formType: "Evento corporativo",
    image: "assets/event-types/01-eventos-corporativos.jpg",
    copy: "A Brave Bear planeja a estrutura audiovisual para encontros corporativos de diferentes formatos, integrando painéis de LED, TVs, sonorização, iluminação e estruturas conforme o espaço e a proposta do evento.",
  },
  {
    title: "Congressos",
    formType: "Congresso ou convenção",
    image: "assets/event-types/02-congressos.jpg",
    copy: "Para congressos, a Brave Bear combina painéis de LED, TVs, sonorização, iluminação e processamento de vídeo para apoiar plenárias, apresentações e debates com comunicação clara para o público.",
  },
  {
    title: "Convenções",
    formType: "Congresso ou convenção",
    image: "assets/event-types/03-convencoes.jpg",
    copy: "A Brave Bear reúne painéis de LED, processamento e controle, sonorização, iluminação e estruturas para dar unidade visual e sonora a convenções de diferentes portes.",
  },
  {
    title: "Palestras",
    formType: "Palestra ou treinamento",
    image: "assets/event-types/04-palestras.jpg",
    copy: "A Brave Bear oferece sonorização, painéis de LED ou TVs, iluminação e processamento de vídeo para valorizar a apresentação e manter conteúdo e palestrante em evidência.",
  },
  {
    title: "Workshops",
    formType: "Palestra ou treinamento",
    image: "assets/event-types/05-workshops.jpg",
    copy: "Em workshops, a Brave Bear integra TVs, painéis de LED e recursos de interatividade a soluções de sonorização e iluminação adequadas ao espaço, apoiando encontros práticos e participativos.",
  },
  {
    title: "Treinamentos",
    formType: "Palestra ou treinamento",
    image: "assets/event-types/06-treinamentos.jpg",
    copy: "A Brave Bear dimensiona TVs ou painéis de LED, processamento e controle, além de sonorização, para apoiar apresentações e atividades de capacitação em diferentes ambientes.",
  },
  {
    title: "Feiras",
    formType: "Feira ou exposição",
    image: "assets/event-types/07-feiras.jpg",
    copy: "A Brave Bear fornece painéis de LED, TVs, estruturas e iluminação para destacar estandes e apresentar conteúdos com visibilidade em pavilhões de feira.",
  },
  {
    title: "Exposições",
    formType: "Feira ou exposição",
    image: "assets/event-types/08-exposicoes.jpg",
    copy: "Para exposições, a Brave Bear combina painéis de LED, televisores, iluminação e recursos de interatividade na criação de ambientes audiovisuais alinhados à proposta de cada espaço.",
  },
  {
    title: "Lançamentos",
    formType: "Lançamento ou premiação",
    image: "assets/event-types/09-lancamentos.jpg",
    copy: "A Brave Bear combina painéis de LED, processamento de vídeo, sonorização, iluminação e estruturas para valorizar a apresentação de produtos e novidades.",
  },
  {
    title: "Premiações",
    formType: "Lançamento ou premiação",
    image: "assets/event-types/10-premiacoes.jpg",
    copy: "A Brave Bear reúne painéis de LED, sonorização, iluminação e estruturas para apoiar os momentos de palco e dar destaque visual à cerimônia de premiação.",
  },
  {
    title: "Eventos sociais",
    formType: "Evento social",
    image: "assets/event-types/11-eventos-sociais.jpg",
    copy: "Em eventos sociais, a Brave Bear oferece sonorização, iluminação, painéis de LED e estruturas para compor uma experiência audiovisual de acordo com o estilo da celebração.",
  },
  {
    title: "Ativações de marca",
    formType: "Ativação de marca",
    image: "assets/event-types/12-ativacoes-de-marca.jpg",
    copy: "A Brave Bear apoia ativações de marca com painéis de LED, TVs, interatividade, sonorização e iluminação, integrando recursos audiovisuais à experiência proposta.",
  },
];
const eventDialog = document.querySelector("#event-dialog");
const eventDialogTitle = document.querySelector("#event-dialog-title");
const eventDialogCopy = document.querySelector("#event-dialog-copy");
const eventDialogImage = document.querySelector("#event-dialog-image");
const eventTypeSelect = document.querySelector(
  "#quote-form [name='eventType']",
);
document.querySelectorAll("[data-event-detail]").forEach((button) => {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.eventDetail);
    const detail = eventExperienceDetails[index];
    if (!detail || !eventDialog) return;
    eventDialog.dataset.eventIndex = String(index);
    eventDialogTitle.textContent = detail.title;
    eventDialogCopy.textContent = detail.copy;
    eventDialogImage.src = detail.image;
    eventDialogImage.alt = `Imagem ilustrativa: ${detail.title}`;
    eventDialog.showModal();
  });
});
document
  .querySelector(".event-dialog-close")
  ?.addEventListener("click", () => eventDialog?.close());
eventDialog?.addEventListener("click", (event) => {
  if (event.target === eventDialog) eventDialog.close();
});
document.querySelector("#event-dialog-quote")?.addEventListener("click", () => {
  const detail =
    eventExperienceDetails[Number(eventDialog?.dataset.eventIndex)];
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
    document
      .querySelector("#orcamento")
      .scrollIntoView({ behavior: "smooth", block: "start" });
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
mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.querySelector("#quote-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const values = new FormData(form);
  const lines = [
    "Olá, Brave Bear! Gostaria de solicitar um orçamento.",
    "",
    `Nome: ${values.get("name")}`,
    `WhatsApp: ${values.get("phone")}`,
    values.get("selectedItem")
      ? `Interesse específico: ${values.get("selectedItem")}`
      : "",
    values.get("selectedKitItems")
      ? `Itens do kit selecionado: ${values.get("selectedKitItems")}`
      : "",
    values.get("description") ? `Mensagem: ${values.get("description")}` : "",
  ].filter(Boolean);
  const feedback = document.querySelector("#form-feedback");
  const message = lines.join("\n");
  const destination = `https://wa.me/5511911728323?text=${encodeURIComponent(message)}`;
  const link = document.createElement("a");
  link.href = destination;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "WhatsApp";
  feedback.replaceChildren(
    "Sua mensagem está pronta. Revise e envie pelo ",
    link,
    ".",
  );
  window.open(destination, "_blank", "noopener,noreferrer");
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "quote_request_prepared",
    source: "website",
    method: "whatsapp",
  });
  if (typeof window.gtag === "function")
    window.gtag("event", "generate_lead", { method: "whatsapp" });
  if (typeof window.fbq === "function") window.fbq("track", "Lead");
});

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

const clientCarousel = document.querySelector(".client-carousel");
const clientTrack = clientCarousel?.querySelector(".client-track");
const clientList = clientTrack?.querySelector(".client-list");
const clientCarouselToggle = clientCarousel?.querySelector(
  ".client-carousel-toggle",
);
if (clientCarousel && clientTrack && clientList && clientCarouselToggle) {
  const duplicateList = clientList.cloneNode(true);
  duplicateList.setAttribute("aria-hidden", "true");
  duplicateList.querySelectorAll("img").forEach((logo) => {
    logo.setAttribute("alt", "");
  });
  clientTrack.append(duplicateList);
  clientTrack.classList.add("is-ready");
  clientCarousel.classList.add("has-controls");

  clientCarouselToggle.addEventListener("click", () => {
    const isPaused = clientTrack.classList.toggle("is-paused");
    clientCarouselToggle.setAttribute("aria-pressed", String(isPaused));
    clientCarouselToggle.setAttribute(
      "aria-label",
      isPaused
        ? "Retomar a rolagem automática das logos"
        : "Pausar a rolagem automática das logos",
    );
    clientCarouselToggle.textContent = isPaused ? "Retomar" : "Pausar";
  });
}

const revealTargets = document.querySelectorAll(
  ".service-card, .kit-card, .equipment-feature, .process-list li, .client-carousel, .quote-form",
);
if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -25px 0px" },
  );
  revealTargets.forEach((element) => {
    element.classList.add("reveal-pending");
    revealObserver.observe(element);
  });
}

const heroPhoto = document.querySelector(".hero-photo");
if (
  heroPhoto &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const shift = -Math.min(window.scrollY * 0.07, 54);
        heroPhoto.style.setProperty("--hero-parallax", `${shift}px`);
        ticking = false;
      });
    },
    { passive: true },
  );
}
