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
  if (typeof window.gtag === "function") {
    window.gtag("event", "quote_form_submit", {
      form_name: "quote_form",
      destination: "whatsapp",
    });
  }
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

/* Utilidades das novas interações da página inicial. */
function whatsappUrl(message) {
  return `https://wa.me/5511911728323?text=${encodeURIComponent(message)}`;
}
function formatDate(value) {
  const [year, month, day] = String(value || "").split("-");
  return year && month && day ? `${day}/${month}/${year}` : "";
}

/* Orçamento em 1 minuto: janela única, aberta por vários pontos do site. */
const quickDialog = document.querySelector("#quick-dialog");
const quickForm = document.querySelector("#quick-quote");
const quickKitNote = document.querySelector("#quick-kit");
const quickKitItems = document.querySelector("#quick-kit-items");

function openQuickQuote(service, kitItems) {
  if (!(quickDialog instanceof HTMLDialogElement) || !quickForm) return false;
  const select = quickForm.elements.quickService;
  if (service && select) {
    const match = [...select.options].find(
      (option) => option.value === service,
    );
    if (match) select.value = match.value;
  }
  if (quickKitItems) quickKitItems.value = kitItems || "";
  if (quickKitNote) {
    quickKitNote.hidden = !kitItems;
    quickKitNote.textContent = kitItems ? `Itens do kit: ${kitItems}` : "";
  }
  document.querySelector("#quick-quote-feedback")?.replaceChildren();
  if (!quickDialog.open) quickDialog.showModal();
  quickForm.elements.quickName?.focus();
  return true;
}

document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const trigger = target?.closest("[data-quick-quote]");
  if (!trigger) return;
  const kit = trigger.closest("[data-kit]") || trigger;
  const opened = openQuickQuote(
    trigger.getAttribute("data-quick-quote") || "",
    kit.getAttribute("data-kit-items") || "",
  );
  if (opened) {
    event.preventDefault();
    closeMenu();
  }
});
document.querySelector("#quick-close")?.addEventListener("click", () => {
  quickDialog?.close();
});
quickDialog?.addEventListener("click", (event) => {
  if (event.target === quickDialog) quickDialog.close();
});

quickForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = new FormData(quickForm);
  const kitItems = String(values.get("quickKitItems") || "");
  const lines = [
    "Olá, Brave Bear! Gostaria de um orçamento.",
    "",
    `Nome: ${values.get("quickName")}`,
    `Serviço: ${values.get("quickService")}`,
    kitItems ? `Itens do kit: ${kitItems}` : "",
    values.get("quickDate")
      ? `Data: ${formatDate(values.get("quickDate"))}`
      : "",
    values.get("quickPlace")
      ? `Cidade ou local: ${values.get("quickPlace")}`
      : "",
  ].filter(Boolean);
  const destination = whatsappUrl(lines.join("\n"));
  const link = document.createElement("a");
  link.href = destination;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "WhatsApp";
  document
    .querySelector("#quick-quote-feedback")
    ?.replaceChildren("Mensagem pronta. Revise e envie pelo ", link, ".");
  window.open(destination, "_blank", "noopener,noreferrer");
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "quote_request_prepared",
    source: "quick_quote_dialog",
    method: "whatsapp",
  });
  if (typeof window.gtag === "function") {
    window.gtag("event", "quote_form_submit", {
      form_name: "quick_quote",
      destination: "whatsapp",
    });
  }
  if (typeof window.fbq === "function") window.fbq("track", "Lead");
});

/* Números: contador estilo odômetro. Sem movimento, o valor final fica direto no HTML. */
const statsGrid = document.querySelector(".stats-grid");
if (
  statsGrid &&
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const numberFormat = new Intl.NumberFormat("pt-BR");
  const counters = [...statsGrid.querySelectorAll("[data-count-to]")];
  const rollers = counters.map((counter) => {
    const finalText = numberFormat.format(Number(counter.dataset.countTo));
    counter.setAttribute("aria-label", finalText);
    counter.replaceChildren();
    const strips = [];
    [...finalText].forEach((char) => {
      const slot = document.createElement("span");
      slot.className = "odo-slot";
      slot.setAttribute("aria-hidden", "true");
      if (/\d/.test(char)) {
        const strip = document.createElement("span");
        strip.className = "odo-strip";
        strip.dataset.digit = char;
        for (let cycle = 0; cycle < 3; cycle += 1) {
          for (let digit = 0; digit < 10; digit += 1) {
            const cell = document.createElement("i");
            cell.textContent = String(digit);
            strip.append(cell);
          }
        }
        slot.append(strip);
        strips.push(strip);
      } else {
        slot.textContent = char;
        slot.classList.add("odo-sep");
      }
      counter.append(slot);
    });
    return strips;
  });
  statsGrid.classList.add("stats-ready");
  new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      counters.forEach((counter, index) => {
        const stat = counter.closest(".stat");
        window.setTimeout(() => {
          stat?.classList.add("is-counted");
          rollers[index].forEach((strip, position) => {
            const spin = Math.floor(Math.random() * 2) + 1;
            strip.style.transitionDelay = `${position * 110}ms`;
            strip.style.setProperty(
              "--odo-y",
              `${-(Number(strip.dataset.digit) + 10 * spin)}em`,
            );
          });
        }, index * 140);
      });
    },
    { threshold: 0.35 },
  ).observe(statsGrid);
}
