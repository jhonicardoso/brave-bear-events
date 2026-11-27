/* Galeria de projetos: lista completa (projetos.html) e página de cada projeto (caso.html). */
(() => {
  const BASES = {
    p: "assets/galeria/projetos/",
    e: "assets/galeria/estandes/",
  };
  const CATS = {
    led: "LED",
    palco: "Palco e plenária",
    interativo: "Interatividade",
    estande: "Estandes e telas",
  };
  const cases = window.GALERIA_CASES || [];
  const root = document.getElementById("galeria-root");
  if (!root) return;

  const esc = (text) =>
    String(text).replace(
      /[&<>"]/g,
      (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch],
    );
  const src = (item, file) => BASES[item.set] + encodeURI(file);

  function card(item, index) {
    const cover = src(item, item.files[0]);
    return `<a class="gcard" href="caso.html?c=${item.slug}" data-cat="${item.cat}" style="--d:${(index % 3) * 90}ms">
      <div class="gcard-media" style="--bg:url('${cover}')"><img src="${cover}" alt="${esc(item.title)}" loading="lazy" decoding="async"></div>
      <span class="gcard-cat">${CATS[item.cat]}</span><h3>${esc(item.title)}</h3><p>${esc(item.desc)}</p><span class="gcard-cta">Ver projeto →</span></a>`;
  }

  function renderList() {
    const filters = ["all", ...Object.keys(CATS)];
    root.innerHTML = `<section class="g-section"><div class="wrap">
      <p class="g-eyebrow">Projetos</p><h1 class="g-title">Todos os <em>projetos.</em></h1>
      <p class="g-lead">Registros reais de campo, com as fotos dos trabalhos. Escolha um projeto para ver todas as imagens.</p>
      <div class="g-filters" role="group" aria-label="Filtrar projetos por tipo">${filters
        .map(
          (key, i) =>
            `<button type="button" data-f="${key}" aria-pressed="${i === 0}" class="${i === 0 ? "is-on" : ""}">${key === "all" ? "Todos" : CATS[key]}</button>`,
        )
        .join("")}</div>
      <div class="g-grid">${cases.map(card).join("")}</div></div></section>`;
    const buttons = root.querySelectorAll(".g-filters button");
    const cards = root.querySelectorAll(".gcard");
    for (const button of buttons) {
      button.addEventListener("click", () => {
        for (const other of buttons) {
          other.classList.toggle("is-on", other === button);
          other.setAttribute("aria-pressed", String(other === button));
        }
        let shown = 0;
        for (const item of cards) {
          const show =
            button.dataset.f === "all" || item.dataset.cat === button.dataset.f;
          item.classList.toggle("is-hide", !show);
          if (!show) continue;
          item.style.animation = "none";
          void item.offsetWidth;
          item.style.animation = "";
          item.style.setProperty("--d", `${(shown++ % 3) * 90}ms`);
        }
      });
    }
  }

  function renderCase(slug) {
    const index = cases.findIndex((item) => item.slug === slug);
    const item = cases[index];
    if (!item) {
      root.innerHTML = `<section class="g-section"><div class="wrap"><p class="g-eyebrow">Projetos</p><h1 class="g-title">Projeto <em>não encontrado.</em></h1><a class="g-link" href="projetos.html">Ver todos os projetos <i>→</i></a></div></section>`;
      return;
    }
    const prev = cases[(index - 1 + cases.length) % cases.length];
    const next = cases[(index + 1) % cases.length];
    const count = item.files.length;
    root.innerHTML = `<article class="g-case wrap">
      <a class="g-back" href="projetos.html">← Todos os projetos</a>
      <div class="g-case-head"><div><p class="g-eyebrow">${CATS[item.cat]}</p><h1 class="g-case-title">${esc(item.title)}</h1></div>
      <div class="g-case-info"><dl><dt>Categoria</dt><dd>${CATS[item.cat]}</dd>${item.date ? `<dt>Período</dt><dd>${esc(item.date)}</dd>` : ""}<dt>Registros</dt><dd>${count} ${count > 1 ? "fotos" : "foto"}</dd></dl>
      <div class="g-case-about"><h2>Sobre o projeto</h2><p>${esc(item.desc)}</p></div></div></div>
      <div class="g-case-media">${item.files
        .map(
          (file) =>
            `<figure class="gmedia"><img src="${src(item, file)}" alt="${esc(item.title)}" loading="lazy" decoding="async"></figure>`,
        )
        .join("")}</div>
      <nav class="g-case-nav" aria-label="Navegação entre projetos">
        <a href="caso.html?c=${prev.slug}"><span>← Projeto anterior</span><strong>${esc(prev.title)}</strong></a>
        <a class="g-case-all" href="projetos.html">Todos os projetos</a>
        <a class="is-next" href="caso.html?c=${next.slug}"><span>Próximo projeto →</span><strong>${esc(next.title)}</strong></a>
      </nav>
      <div class="g-cta"><div><h2>Quer um projeto como este?</h2><p>Fale com a equipe e conte o que o seu evento precisa.</p></div><a class="button" href="index.html#orcamento">Fale com nossa equipe <span aria-hidden="true">↗</span></a></div>
    </article>`;
    document.title = `${item.title} | Brave Bear Events`;
    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.classList.add("is-in");
                observer.unobserve(entry.target);
              }
            },
            { threshold: 0.08 },
          )
        : null;
    for (const figure of root.querySelectorAll(".gmedia")) {
      const image = figure.querySelector("img");
      const fit = () => {
        if (image.naturalHeight > image.naturalWidth)
          figure.classList.add("is-portrait");
      };
      if (image.complete && image.naturalWidth) fit();
      else image.addEventListener("load", fit);
      if (observer) observer.observe(figure);
      else figure.classList.add("is-in");
    }
  }

  if (document.body.dataset.page === "caso")
    renderCase(new URLSearchParams(location.search).get("c"));
  else renderList();
})();
