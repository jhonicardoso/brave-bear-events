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

  if (
    !(track instanceof HTMLElement) ||
    !(controls instanceof HTMLElement) ||
    !(previous instanceof HTMLButtonElement) ||
    !(next instanceof HTMLButtonElement) ||
    !(dialog instanceof HTMLDialogElement) ||
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
