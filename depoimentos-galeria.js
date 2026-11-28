// Pixels por segundo da rolagem automática: devagar o bastante para ler cada cartão.
const MARQUEE_SPEED = 45;

/** @param {Document} doc */
function initReviews(doc) {
  const root = doc.querySelector(".reviews");
  const viewport = root?.querySelector(".reviews-viewport");
  const rail = root?.querySelector(".reviews-rail");
  const track = root?.querySelector(".reviews-track");
  const controls = root?.querySelector(".reviews-controls");
  const previous = root?.querySelector('[data-review-step="-1"]');
  const next = root?.querySelector('[data-review-step="1"]');
  const toggle = root?.querySelector(".reviews-toggle");
  const dialog = root?.querySelector(".reviews-dialog");
  const image = dialog?.querySelector("img");
  const title = dialog?.querySelector("h4");
  const firstCard = track?.querySelector("li");

  if (
    !(root instanceof HTMLElement) ||
    !(viewport instanceof HTMLElement) ||
    !(rail instanceof HTMLElement) ||
    !(track instanceof HTMLElement) ||
    !(controls instanceof HTMLElement) ||
    !(previous instanceof HTMLButtonElement) ||
    !(next instanceof HTMLButtonElement) ||
    !(toggle instanceof HTMLButtonElement) ||
    !(dialog instanceof HTMLDialogElement) ||
    !image ||
    !title ||
    !firstCard
  )
    return;

  // Segunda lista idêntica: ao deslocar -50% o final encaixa no início sem salto.
  const clone = /** @type {HTMLElement} */ (track.cloneNode(true));
  clone.classList.add("is-clone");
  clone.setAttribute("aria-hidden", "true");
  clone.removeAttribute("aria-label");
  for (const link of clone.querySelectorAll("a")) link.tabIndex = -1;
  for (const logo of clone.querySelectorAll("img")) logo.alt = "";
  rail.append(clone);

  // Clique para ampliar vale para as duas listas.
  for (const link of rail.querySelectorAll("a")) {
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      image.src = link.href;
      image.alt = link.querySelector("img")?.alt ?? "";
      title.textContent =
        link
          .getAttribute("aria-label")
          ?.replace("Ampliar depoimento", "Depoimento") ?? "Depoimento";
      dialog.showModal();
      syncPause();
    });
  }
  dialog.addEventListener("close", () => syncPause());

  // Rolagem manual (setas): usada quando o visitante pede menos movimento.
  const updateControls = () => {
    previous.disabled = viewport.scrollLeft <= 1;
    next.disabled =
      viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 1;
  };
  /** @param {number} direction */
  const move = (direction) => {
    const gap = Number.parseFloat(getComputedStyle(track).columnGap);
    viewport.scrollBy({ left: direction * (firstCard.offsetWidth + gap) });
  };
  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  viewport.addEventListener("scroll", updateControls, { passive: true });
  new ResizeObserver(updateControls).observe(viewport);

  // Velocidade constante, qualquer que seja o número de cartões.
  const updateDuration = () => {
    if (track.offsetWidth)
      rail.style.setProperty(
        "--reviews-duration",
        `${track.offsetWidth / MARQUEE_SPEED}s`,
      );
  };
  new ResizeObserver(updateDuration).observe(track);

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let userPaused = false;
  let onScreen = false;

  function syncPause() {
    rail.classList.toggle("is-paused", userPaused || !onScreen || dialog.open);
  }

  function applyMode() {
    const marquee = !reducedMotion.matches;
    root.classList.toggle("is-marquee", marquee);
    toggle.hidden = !marquee;
    previous.hidden = marquee;
    next.hidden = marquee;
    if (marquee) viewport.scrollLeft = 0;
    updateDuration();
    updateControls();
  }

  toggle.addEventListener("click", () => {
    userPaused = !userPaused;
    toggle.setAttribute("aria-pressed", String(userPaused));
    toggle.setAttribute(
      "aria-label",
      userPaused
        ? "Retomar a rolagem automática dos depoimentos"
        : "Pausar a rolagem automática dos depoimentos",
    );
    toggle.textContent = userPaused ? "Retomar" : "Pausar";
    syncPause();
  });

  // Não gasta animação quando a faixa está fora da tela.
  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    syncPause();
  }).observe(viewport);

  reducedMotion.addEventListener("change", applyMode);
  controls.hidden = false;
  applyMode();
}

initReviews(document);
