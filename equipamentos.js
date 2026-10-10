const { categories, products } = window.BRAVE_CATALOG;
const categoryCopy = {
  led: { application: "Painéis, pisos e cubos de LED levam conteúdo visual ao palco, à plenária, ao estande ou a áreas de circulação. A montagem é escolhida conforme o espaço e a proposta do evento.", uses: ["Palcos e plenárias", "Estandes e feiras", "Lançamentos", "Instalações de marca"] },
  interactive: { application: "Totens e dispositivos interativos podem apoiar ativações de marca, cadastros, consultas de conteúdo e experiências digitais. A dinâmica e o conteúdo são definidos de acordo com o objetivo do projeto.", uses: ["Ativações de marca", "Feiras e exposições", "Lançamentos", "Experiências digitais"] },
  televisions: { application: "Televisores podem distribuir apresentações, sinalização e conteúdo de apoio em salas, estandes e áreas de recepção. O tamanho e o suporte dependem da distância de visualização e do ambiente.", uses: ["Salas de apoio", "Credenciamento", "Estandes", "Conteúdo complementar"] },
  projection: { application: "Projetores e telas ampliam apresentações e conteúdos visuais em plenárias, salas e cenografias. A solução é planejada considerando o espaço, a superfície de projeção e a distância disponível.", uses: ["Apresentações", "Plenárias", "Cenografia", "Projeção em tela"] },
  processing: { application: "Processadores, gerenciamento e conexões ajudam a organizar o sinal e o controle de sistemas de vídeo e painéis de LED. A seleção depende dos equipamentos e do desenho técnico do evento.", uses: ["Controle de LED", "Distribuição de sinal", "Operação de vídeo", "Integração audiovisual"] },
  audio: { application: "Mesas, microfones e caixas de som atendem falas, apresentações e conteúdos sonoros. A equipe considera o formato do evento, o ambiente e a cobertura necessária para compor o sistema.", uses: ["Palestras e debates", "Congressos", "Apresentações", "Eventos sociais"] },
  lighting: { application: "A iluminação cênica contribui para a leitura do palco, destaca momentos da programação e ajuda a compor a atmosfera do ambiente. Os equipamentos variam conforme o efeito e o espaço desejados.", uses: ["Palcos", "Ambientação", "Shows e apresentações", "Destaque de produtos"] },
  structure: { application: "Treliças e acessórios podem formar suportes para equipamentos e elementos de montagem. A configuração é definida a partir do projeto, dos pontos de instalação e das condições do local.", uses: ["Suporte para audiovisual", "Montagens de palco", "Estandes", "Organização de cabos"] }
};
const params = new URLSearchParams(window.location.search);
const initialCategory = params.get("categoria");
let activeCategory = categories.some(({ id }) => id === initialCategory) ? initialCategory : "led";
const $ = (selector) => document.querySelector(selector);
const hero = $("#equipment-detail-hero");
const title = $("#equipment-page-title");
const tagline = $("#equipment-detail-tagline");
const count = $("#equipment-hero-count");
const heroImage = $("#equipment-detail-hero-image");
const application = $("#equipment-application-description");
const uses = $("#equipment-use-chips");
const grid = $("#equipment-product-grid");
const search = $("#equipment-page-search");
const empty = $("#equipment-page-empty");

function categoryHref(id) { return `equipamentos.html?categoria=${encodeURIComponent(id)}`; }
function productImageIndex(categoryId, index) {
  if (categoryId === "interactive") return [1, 2, 3, 3, 3, 3, 3, 3, 4, 5][index];
  if (categoryId === "led") return [1, 2, 3, 4, 5, 6, 7, 9, 8][index];
  return index + 1;
}
const ledCubeImages = [
  { desktop: "assets/cubos/cubo-no-piso-desktop.jpg", mobile: "assets/cubos/cubo-no-piso-mobile.jpg", alt: "Cubo de LED instalado no piso com conteúdo de marca" },
  { desktop: "assets/cubos/cubo-empilhado-desktop.jpg", mobile: "assets/cubos/cubo-empilhado-mobile.jpg", alt: "Cubos de LED empilhados em um expositor de marca" },
  { desktop: "assets/cubos/cubo-suspenso-desktop.jpg", mobile: "assets/cubos/cubo-suspenso-mobile.jpg", alt: "Cubo de LED suspenso em um ambiente de evento" }
];
function contactHref(category, product = "") {
  const message = `Olá, Brave Bear! Estou consultando o catálogo de ${category.label}${product ? ` e gostaria de informações sobre ${product}` : ""}. Podemos conversar sobre a aplicação no meu evento?`;
  return `https://wa.me/5511911728323?text=${encodeURIComponent(message)}`;
}
function renderProducts() {
  const category = categories.find(({ id }) => id === activeCategory);
  const query = search.value.trim().toLocaleLowerCase("pt-BR");
  const matches = (products[activeCategory] || []).map(([name, detail], index) => ({ name, detail, index }))
    .filter(({ name, detail }) => `${name} ${detail}`.toLocaleLowerCase("pt-BR").includes(query));
  grid.innerHTML = matches.map(({ name, detail, index }) => {
    if (activeCategory === "led" && index >= 9) {
      const image = ledCubeImages[index - 9];
      const itemDetail = detail || "Consulte composição e disponibilidade";
      return `<article class="equipment-product-card equipment-product-card-cube">
        <div class="equipment-product-image-wrap"><picture class="equipment-product-picture"><source media="(max-width: 600px)" srcset="${image.mobile}"><img src="${image.desktop}" alt="${image.alt}" loading="lazy" width="720" height="720"></picture></div>
        <div class="equipment-product-info"><span class="equipment-product-category">${category.short}</span><h3>${name}</h3><p>${itemDetail}</p><a href="${contactHref(category, name)}" target="_blank" rel="noopener noreferrer">Consultar este item <span aria-hidden="true">↗</span></a></div>
      </article>`;
    }
    const photoIndex = productImageIndex(activeCategory, index);
    const image = `assets/catalog-items/${activeCategory}-${String(photoIndex).padStart(2, "0")}.webp`;
    const itemDetail = detail || "Consulte composição e disponibilidade";
    return `<article class="equipment-product-card">
      <div class="equipment-product-image-wrap"><img src="${image}" alt="${name}" loading="lazy" width="320" height="320"></div>
      <div class="equipment-product-info"><span class="equipment-product-category">${category.short}</span><h3>${name}</h3><p>${itemDetail}</p><a href="${contactHref(category, name)}" target="_blank" rel="noopener noreferrer">Consultar este item <span aria-hidden="true">↗</span></a></div>
    </article>`;
  }).join("");
  empty.hidden = matches.length > 0;
}
function renderCategory() {
  const category = categories.find(({ id }) => id === activeCategory);
  const index = categories.indexOf(category) + 1;
  const details = categoryCopy[activeCategory];
  document.title = `${category.label} | Catálogo Brave Bear Events`;
  title.textContent = category.label;
  tagline.textContent = category.tagline;
  count.textContent = category.count.toUpperCase();
  $("#equipment-current-index").textContent = `${String(index).padStart(2, "0")} / ${String(categories.length).padStart(2, "0")}`;
  heroImage.style.setProperty("--detail-image", `url('${category.image}')`);
  application.textContent = details.application;
  uses.innerHTML = details.uses.map((use) => `<span>${use}</span>`).join("");
  const nav = $("#equipment-category-nav");
  nav.innerHTML = categories.map((item) => `<a href="${categoryHref(item.id)}" data-equipment-link="${item.id}"${item.id === activeCategory ? ' aria-current="page"' : ""}><span>${item.short}</span><small>${item.count}</small></a>`).join("");
  $("#equipment-contact-cta").href = contactHref(category);
  renderProducts();
}

renderCategory();
search.addEventListener("input", renderProducts);
document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-equipment-link]");
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const next = categories.find(({ id }) => id === link.dataset.equipmentLink);
  const overlay = $("#catalog-transition");
  if (!next || !overlay) { window.location.href = link.href; return; }
  $("#catalog-transition-title").textContent = next.label;
  overlay.style.setProperty("--transition-image", `url('${next.image}')`);
  overlay.setAttribute("aria-hidden", "false");
  overlay.classList.add("is-active");
  document.body.classList.add("catalog-transitioning");
  window.setTimeout(() => { window.location.href = link.href; }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 560);
});
