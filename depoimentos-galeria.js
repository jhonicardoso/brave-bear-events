/** @param {Document} doc */
function initReviews(doc) {
  const track = doc.querySelector(".reviews-track");
  const controls = doc.querySelector(".reviews-controls");
  const previous = doc.querySelector('[data-review-step="-1"]');
  const next = doc.querySelector('[data-review-step="1"]');
  const dialog = doc.querySelector(".reviews-dialog");
  const image = dialog?.querySelector("img");
  const title = dialog?.querySelector("h4");
  const firstCard = track?.querySelector("li");
  const toggle = controls?.querySelector(".reviews-toggle");

  if (
    !(track instanceof HTMLElement) ||
    !(controls instanceof HTMLElement) ||
    !(previous instanceof HTMLButtonElement) ||
    !(next instanceof HTMLButtonElement) ||
    !(dialog instanceof HTMLDialogElement) ||
    !(toggle instanceof HTMLButtonElement) ||
    !image ||
    !title ||
    !firstCard
  )
    return;

  controls.hidden = false;
  const updateControls = () => {
    previous.disabled = track.scrollLeft <= 1;
    next.disabled =
      track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
  };
  /** @param {number} direction */
  const move = (direction) => {
    const gap = Number.parseFloat(getComputedStyle(track).columnGap);
    track.scrollBy({ left: direction * (firstCard.offsetWidth + gap) });
  };
  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  track.addEventListener("scroll", updateControls, { passive: true });
  new ResizeObserver(updateControls).observe(track);
  updateControls();

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let visible = false;
  let hovering = false;
  let paused = false;
  let direction = 1;

  const updateToggle = () => {
    toggle.hidden = reducedMotion.matches;
    toggle.textContent = paused ? "Retomar rotação" : "Pausar rotação";
  };

  toggle.addEventListener("click", () => {
    paused = !paused;
    updateToggle();
  });
  reducedMotion.addEventListener("change", updateToggle);
  updateToggle();

  track.addEventListener("pointerenter", (event) => {
    hovering = event.pointerType === "mouse";
  });
  track.addEventListener("pointerleave", () => {
    hovering = false;
  });
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  observer.observe(track);

  window.setInterval(() => {
    if (
      !visible ||
      doc.hidden ||
      paused ||
      hovering ||
      reducedMotion.matches ||
      dialog.open ||
      (doc.activeElement !== toggle && controls.contains(doc.activeElement)) ||
      track.contains(doc.activeElement)
    ) {
      return;
    }
    if (next.disabled) direction = -1;
    if (previous.disabled) direction = 1;
    move(direction);
  }, 6000);

  for (const link of track.querySelectorAll("a")) {
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
    });
  }
}

initReviews(document);
