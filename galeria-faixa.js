// Faixa de destaques da home: rolagem contínua, igual às marcas e aos depoimentos.
// Pixels por segundo: devagar o bastante para ver cada projeto.
const STRIP_SPEED = 55;

/** @param {Document} doc */
function initGalleryStrip(doc) {
  const root = doc.querySelector(".g-strip");
  const viewport = root?.querySelector(".g-strip-viewport");
  const rail = root?.querySelector(".g-strip-rail");
  const list = root?.querySelector(".g-strip-list");
  const controls = root?.querySelector(".g-strip-controls");
  const previous = root?.querySelector('[data-strip-step="-1"]');
  const next = root?.querySelector('[data-strip-step="1"]');
  const toggle = root?.querySelector(".g-strip-toggle");
  const firstCard = list?.querySelector(".gcard");

  if (
    !(root instanceof HTMLElement) ||
    !(viewport instanceof HTMLElement) ||
    !(rail instanceof HTMLElement) ||
    !(list instanceof HTMLElement) ||
    !(controls instanceof HTMLElement) ||
    !(previous instanceof HTMLButtonElement) ||
    !(next instanceof HTMLButtonElement) ||
    !(toggle instanceof HTMLButtonElement) ||
    !(firstCard instanceof HTMLElement)
  )
    return;

  // Segunda lista idêntica: ao deslocar -50% o final encaixa no início sem salto.
  const clone = /** @type {HTMLElement} */ (list.cloneNode(true));
  clone.classList.add("is-clone");
  clone.setAttribute("aria-hidden", "true");
  for (const link of clone.querySelectorAll("a")) link.tabIndex = -1;
  for (const photo of clone.querySelectorAll("img")) {
    photo.alt = "";
    photo.loading = "eager";
  }
  rail.append(clone);

  // Rolagem manual (setas): usada quando o visitante pede menos movimento.
  const updateControls = () => {
    previous.disabled = viewport.scrollLeft <= 1;
    next.disabled =
      viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 1;
  };
  /** @param {number} direction */
  const move = (direction) => {
    const gap = Number.parseFloat(getComputedStyle(list).columnGap);
    viewport.scrollBy({ left: direction * (firstCard.offsetWidth + gap) });
  };
  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  viewport.addEventListener("scroll", updateControls, { passive: true });
  new ResizeObserver(updateControls).observe(viewport);

  // Velocidade constante, qualquer que seja o número de projetos.
  const updateDuration = () => {
    if (list.offsetWidth)
      rail.style.setProperty(
        "--g-strip-duration",
        `${list.offsetWidth / STRIP_SPEED}s`,
      );
  };
  new ResizeObserver(updateDuration).observe(list);

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let userPaused = false;
  let onScreen = false;

  const syncPause = () => {
    rail.classList.toggle("is-paused", userPaused || !onScreen);
  };

  const applyMode = () => {
    const marquee = !reducedMotion.matches;
    root.classList.toggle("is-marquee", marquee);
    toggle.hidden = !marquee;
    previous.hidden = marquee;
    next.hidden = marquee;
    if (marquee) viewport.scrollLeft = 0;
    updateDuration();
    updateControls();
  };

  toggle.addEventListener("click", () => {
    userPaused = !userPaused;
    toggle.setAttribute("aria-pressed", String(userPaused));
    toggle.setAttribute(
      "aria-label",
      userPaused
        ? "Retomar a rolagem automática dos projetos"
        : "Pausar a rolagem automática dos projetos",
    );
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

initGalleryStrip(document);
