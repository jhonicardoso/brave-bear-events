const { categories = [] } = window.BRAVE_CATALOG || {};

const categoryGrid = document.querySelector("#equipment-categories");
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

document.addEventListener("click", (event) => {
  const kitCard = event.target.closest(".kit-card");
  if (kitCard) {
    kitCard.classList.remove("is-clicked");
    void kitCard.offsetWidth;
    kitCard.classList.add("is-clicked");
    window.setTimeout(() => kitCard.classList.remove("is-clicked"), 520);
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
  ".service-card, .kit-card, .equipment-feature, .team-structure-head, .team-card, .digital-head, .digital-card, .digital-steps, .founder-card, .projects-section .gcard, .client-carousel",
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

const heroVideo = document.querySelector(".hero-video");
if (heroVideo) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sync = (visible) => {
    if (reduce.matches || !visible) heroVideo.pause();
    else heroVideo.play().catch(() => {});
  };
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => sync(entry.isIntersecting), {
      threshold: 0.05,
    }).observe(heroVideo);
  }
  reduce.addEventListener("change", () => sync(true));
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

// Brilho que acompanha o mouse nos cartões da equipe.
for (const card of document.querySelectorAll(
  ".team-card, .equipment-feature, .digital-card",
)) {
  card.addEventListener("pointermove", (event) => {
    const box = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - box.left}px`);
    card.style.setProperty("--my", `${event.clientY - box.top}px`);
  });
}

// Prova social: mostra a seção somente quando há depoimentos reais em depoimentos-data.js.
const socialSection = document.querySelector("#depoimentos");
const socialGrid = document.querySelector("#social-grid");
const socialItems = Array.isArray(window.BRAVE_DEPOIMENTOS)
  ? window.BRAVE_DEPOIMENTOS.filter((item) => item?.quote && item?.name)
  : [];
if (socialSection && socialGrid && socialItems.length) {
  for (const [index, item] of socialItems.entries()) {
    const card = document.createElement("figure");
    card.className = `social-card${index === 0 ? " social-card-featured" : ""}`;
    const mark = document.createElement("span");
    mark.className = "social-mark";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = "“";
    const quote = document.createElement("blockquote");
    quote.textContent = item.quote;
    const caption = document.createElement("figcaption");
    const avatar = document.createElement("span");
    avatar.className = "social-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = item.name
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
    const who = document.createElement("span");
    const name = document.createElement("strong");
    name.textContent = item.name;
    const role = document.createElement("small");
    role.textContent = [item.role, item.company].filter(Boolean).join(" · ");
    who.append(name, role);
    caption.append(avatar, who);
    if (item.source) {
      const source = document.createElement("em");
      source.textContent = item.source;
      caption.append(source);
    }
    card.append(mark, quote, caption);
    socialGrid.append(card);
  }
  socialSection.hidden = false;
}
