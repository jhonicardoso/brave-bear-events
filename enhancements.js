// @ts-check

/** Observe each image once; delegated events also cover catalog images added later. */
function initializeImages() {
  /** @param {HTMLImageElement} image */
  function settle(image) {
    image.classList.remove("image-pending");
    image.classList.toggle("image-failed", image.naturalWidth === 0);
  }
  /** @param {HTMLImageElement} image */
  function prepare(image) {
    image.decoding = "async";
    if (image.complete) settle(image);
    else image.classList.add("image-pending");
  }
  document.querySelectorAll("img").forEach(prepare);
  for (const event of ["load", "error"]) {
    document.addEventListener(
      event,
      (event) => {
        if (event.target instanceof HTMLImageElement) settle(event.target);
      },
      true,
    );
  }
  new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node instanceof HTMLImageElement) prepare(node);
        node.querySelectorAll("img").forEach(prepare);
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
}

/** Load optional scripts shortly before their section enters the viewport. */
function initializeDeferredScripts() {
  document.querySelectorAll("[data-lazy-script]").forEach((section) => {
    const source = section.getAttribute("data-lazy-script");
    if (!source) return;
    let started = false;
    const load = () => {
      if (started) return;
      started = true;
      const script = document.createElement("script");
      script.src = source;
      script.async = true;
      script.addEventListener("error", () => {
        started = false;
        section.setAttribute("data-load-error", "true");
      });
      script.addEventListener("load", () => {
        section.removeAttribute("data-load-error");
        section.removeAttribute("data-lazy-script");
      });
      if (source.includes("ra-verified")) {
        const placeholder = section.querySelector("[data-seal-id]");
        if (placeholder) {
          script.id = "ra-embed-verified-seal";
          script.dataset.id = placeholder.getAttribute("data-seal-id") || "";
          script.dataset.target = section.id;
          script.dataset.model = "horizontal_1";
        }
      }
      section.append(script);
    };
    // Keyboard and pointer interactions retry failed loads as well.
    section.addEventListener("focusin", load);
    section.addEventListener("pointerover", load);
    if (!("IntersectionObserver" in window)) {
      load();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(section);
  });
}

initializeImages();
initializeDeferredScripts();
