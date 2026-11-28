import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // External services are outside this deterministic local validation.
  await page.route(/^https:\/\//, (route) => route.abort());
});

for (const path of [
  "/",
  "/equipamentos.html",
  "/calculadora-led.html",
  "/projetos.html",
  "/caso.html?c=experiencia-imersiva-mar-2026",
  "/contato.html",
]) {
  test(`${path}: runtime, landmarks and responsive layout`, async ({
    page,
  }) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("catalog search, invalid category fallback and image dialog", async ({
  page,
}) => {
  await page.goto("/equipamentos.html?categoria=%3Cscript%3E");
  await expect(page.locator("h1")).toHaveText("Painel de LED");
  const search = page.locator("#equipment-page-search");
  await search.fill("inexistente");
  await expect(page.locator("#equipment-page-empty")).toBeVisible();
  await search.fill("P1.9");
  await expect(page.locator(".equipment-product-card")).toHaveCount(1);
  await page.locator(".equipment-image-trigger").click();
  await expect(page.locator("#equipment-image-dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#equipment-image-dialog")).not.toBeVisible();
});

test("calculator validates limits and clears stale results", async ({
  page,
}) => {
  await page.goto("/calculadora-led.html");
  await expect(page.locator('[data-result="tiles"]')).toHaveText("60 placas");
  await page.locator('[name="width"]').fill("0");
  await expect(page.locator("#led-calc-feedback")).toContainText("Revise");
  await expect(page.locator("#led-map > *")).toHaveCount(0);
  await page.locator('[name="width"]').fill("100");
  await page.locator('[name="height"]').fill("100");
  await expect(page.locator("#led-calc-feedback")).toContainText("10.000");
  await page.locator('[name="width"]').fill("5");
  await page.locator('[name="height"]').fill("3");
  await expect(page.locator('[data-result="tiles"]')).toHaveText("60 placas");
});

test("home não tem formulário de contato e leva à página de contato", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.locator("#orcamento");
  await expect(section.locator("form")).toHaveCount(0);
  await expect(section.locator("input, textarea")).toHaveCount(0);
  await expect(
    section.getByRole("link", { name: /página de contato/ }),
  ).toHaveAttribute("href", "contato.html");
});

test("Brave Bear Digital apresenta software, apps e experiências digitais", async ({
  page,
}) => {
  await page.goto("/");
  const lab = page.locator("#interatividade");
  await expect(lab.locator("h2")).toContainText("Software, apps");
  await expect(lab.locator(".digital-card")).toHaveCount(3);
  await expect(lab.locator(".digital-steps > li")).toHaveCount(4);
  await lab.scrollIntoViewIfNeeded();
  const action = lab.getByRole("link", { name: /Desenvolver meu projeto/ });
  await expect(action).toHaveAttribute(
    "data-quick-quote",
    "Software ou aplicativo",
  );
  await action.click();
  await expect(page.locator("#quick-dialog")).toBeVisible();
  await expect(page.locator('#quick-quote [name="quickService"]')).toHaveValue(
    "Software ou aplicativo",
  );
});

test("venda e locação apresentam navegação e contato para compra", async ({
  page,
}) => {
  await page.goto("/");
  const heroLinks = page.locator(".hero-actions a");
  await expect(heroLinks).toHaveCount(2);
  await expect(heroLinks.nth(0)).toContainText("Locação");
  await expect(heroLinks.nth(0)).toHaveAttribute("href", "#equipamentos");
  await expect(heroLinks.nth(1)).toContainText("Venda");
  await expect(heroLinks.nth(1)).toHaveAttribute(
    "href",
    "equipamentos.html?categoria=venda",
  );
  await expect(page.locator(".commercial-path")).toHaveCount(2);
  await page.goto("/equipamentos.html?categoria=venda");
  await expect(page.locator("#equipment-page-title")).toHaveText(
    "Venda de Painéis de LED",
  );
  await expect(page.locator(".equipment-product-card")).toHaveCount(8);
  const contact = page.locator(".equipment-product-card a").first();
  await expect(contact).toContainText("Solicitar proposta de compra");
  const href = await contact.getAttribute("href");
  expect(new URL(href).searchParams.get("text")).toContain(
    "interesse na compra",
  );
});

test("venda LED apresenta soluções consultivas sem dados de fornecedor", async ({
  page,
}) => {
  await page.goto("/equipamentos.html?categoria=venda");
  await expect(page.locator("#sale-consulting")).toBeVisible();
  await expect(page.locator(".sale-use-grid article")).toHaveCount(3);
  await expect(page.locator(".sale-method > div")).toHaveCount(3);
  await expect(page.locator(".equipment-product-card")).toHaveCount(8);
  await expect(page.locator("body")).not.toContainText("Pronta entrega");
  await page.goto("/equipamentos.html?categoria=led");
  await expect(page.locator("#sale-consulting")).toBeHidden();
});

test("card de interatividade mantém identidade visual escura e fotografia no catálogo", async ({
  page,
}) => {
  await page.goto("/");
  const card = page.locator('.equipment-feature[data-category="interactive"]');
  await expect(card).toBeVisible();
  await expect(card).toContainText("Interatividade");
  const styling = await card.evaluate((element) => {
    const before = getComputedStyle(element, "::before");
    return {
      image: before.backgroundImage,
      surface: getComputedStyle(element).backgroundColor,
    };
  });
  expect(styling.image).toContain("linear-gradient");
  expect(styling.image).toContain(
    "totem-interatividade-brave-bear.jpg?v=20261116-hd",
  );
  expect(styling.image).not.toContain("rgba(0, 48, 102");
  expect(styling.image).not.toContain("rgba(5, 24, 53");
  expect(styling.surface).toBe("rgb(7, 22, 38)");
});

test("mobile hero follows content without excessive empty space", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const positions = await page.evaluate(() => {
    const hero = document.querySelector(".hero").getBoundingClientRect();
    const note = document
      .querySelector(".hero-actions")
      .getBoundingClientRect();
    const next = document
      .querySelector(".commercial-paths")
      .getBoundingClientRect();
    return {
      heroBottom: hero.bottom,
      noteBottom: note.bottom,
      nextTop: next.top,
    };
  });
  expect(positions.heroBottom - positions.noteBottom).toBeLessThan(150);
  expect(Math.abs(positions.nextTop - positions.heroBottom)).toBeLessThan(2);
});

test("seção digital cabe na tela sem rolagem horizontal", async ({ page }) => {
  await page.goto("/");
  await page.locator("#interatividade").scrollIntoViewIfNeeded();
  await expect(
    page.locator("#interatividade .digital-card").first(),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("interactive catalog hero uses the shared premium image", async ({
  page,
}) => {
  await page.goto("/equipamentos.html?categoria=interactive");
  const hero = page.locator("#equipment-detail-hero-image");
  expect(
    await hero.evaluate((el) =>
      getComputedStyle(el).getPropertyValue("--detail-image"),
    ),
  ).toContain("totem-interatividade-brave-bear.jpg?v=20261116-hd");
});

test("orçamento em 1 minuto abre em janela, recebe o kit e monta o WhatsApp", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#quick-dialog")).toBeHidden();
  await page.locator('[data-kit="Kit Palestra"]').click();
  const dialog = page.locator("#quick-dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[name="quickService"]')).toHaveValue(
    "Kit Palestra",
  );
  await expect(dialog.locator("#quick-kit")).toContainText("Itens do kit");
  await dialog.locator('[name="quickName"]').fill("<b>Ana</b>");
  const popup = page.waitForEvent("popup");
  await dialog.locator('button[type="submit"]').click();
  await popup.catch(() => undefined);
  const link = dialog.locator("#quick-quote-feedback a");
  const text = new URL(await link.getAttribute("href")).searchParams.get(
    "text",
  );
  expect(text).toContain("Kit Palestra");
  expect(text).toContain("<b>Ana</b>");
  expect(text).toContain("Itens do kit");
  await dialog.locator("#quick-close").click();
  await expect(dialog).toBeHidden();
});

test("números do topo terminam nos valores finais e não há calculadora na home", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#calculadora")).toHaveCount(0);
  await page.locator(".stats-grid").scrollIntoViewIfNeeded();
  const first = page.locator(".stat-value").first();
  const value =
    (await first.getAttribute("aria-label")) ?? (await first.textContent());
  expect(value).toMatch(/220/);
  await expect(
    page.locator(".stat-label", { hasText: "projetos entregues" }),
  ).toHaveCount(1);
});

test("calculadora tem passos simples, atalhos de tamanho e orçamento pronto", async ({
  page,
}) => {
  await page.goto("/calculadora-led.html");
  await page.getByRole("button", { name: "6 × 3,5 m" }).click();
  await expect(page.locator('[name="width"]')).toHaveValue("6");
  await expect(page.locator('[data-result="tiles"]')).toHaveText("84 placas");
  await expect(page.locator('[data-result="sentence"]')).toContainText(
    "84 placas",
  );
  await expect(page.locator(".calc-advanced")).not.toHaveAttribute("open", "");
  const href = await page.locator("#led-calc-quote").getAttribute("href");
  expect(new URL(href).searchParams.get("text")).toContain("84 placas");
});

test("home: seções removidas, estrutura da equipe antes dos fundadores e galeria de destaques", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#eventos")).toHaveCount(0);
  await expect(page.locator("#como-funciona")).toHaveCount(0);
  await expect(page.locator(".team-card")).toHaveCount(4);
  await expect(
    page.getByText("Comercial, operação, logística e software conectados."),
  ).toBeAttached();
  const teamBeforeFounders = await page.evaluate(() => {
    const team = document.querySelector(".team-structure");
    const founders = document.querySelector(".founders-wrap");
    return Boolean(
      team.compareDocumentPosition(founders) & Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
  expect(teamBeforeFounders).toBe(true);
  await expect(page.locator("#projetos .gcard")).toHaveCount(6);
  await expect(
    page.getByRole("link", { name: /Ver todos os projetos/ }),
  ).toHaveAttribute("href", "projetos.html");
});

test("galeria: filtro por tipo, página de projeto e navegação entre projetos", async ({
  page,
}) => {
  await page.goto("/projetos.html");
  await expect(page.locator(".gcard")).toHaveCount(28);
  await page.getByRole("button", { name: "LED" }).click();
  await expect(page.locator(".gcard:not(.is-hide)")).toHaveCount(2);
  await page.locator(".gcard:not(.is-hide)").first().click();
  await expect(page).toHaveURL(/caso\.html\?c=/);
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".gmedia img").first()).toBeAttached();
  const before = page.url();
  await page.getByRole("link", { name: /Próximo projeto/ }).click();
  await expect(page).toHaveURL(/caso\.html\?c=/);
  expect(page.url()).not.toBe(before);
});

test("home: sem introdução 'Mais do que equipamentos', sem contato duplicado e com rodapé limpo", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#contato")).toHaveCount(0);
  await expect(page.locator(".contact-strip")).toHaveCount(0);
  await expect(page.getByText("Mais do que equipamentos.")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Contato", exact: true }).first(),
  ).toHaveAttribute("href", "contato.html");
  const footer = page.locator(".site-footer-clean");
  await expect(footer.getByText("Onde estamos")).toBeAttached();
  await expect(footer.getByText("Fale conosco")).toBeAttached();
  await expect(footer.locator(".footer-clean-social a")).toHaveCount(4);
});

test("contato: dados da empresa e formulário que prepara a mensagem no WhatsApp", async ({
  page,
}) => {
  await page.goto("/contato.html");
  await expect(page.locator("h1")).toHaveText("Contato");
  await expect(
    page.locator(".contact-info").getByText("comercial@bravebear.com.br"),
  ).toBeVisible();
  await page.getByRole("button", { name: /Enviar mensagem/ }).click();
  await expect(page.locator("#form-feedback")).toContainText("Preencha nome");
  await page.getByLabel(/Nome completo/).fill("Maria Teste");
  await page.getByLabel(/WhatsApp \*/).fill("11 90000-0000");
  await page.getByLabel(/Painel de LED/).check();
  await page.getByLabel(/Conte mais/).fill("Convenção para 300 pessoas");
  await page.getByRole("button", { name: /Enviar mensagem/ }).click();
  const link = page.locator("#form-feedback a");
  const url = new URL(await link.getAttribute("href"));
  expect(url.hostname).toBe("wa.me");
  const text = url.searchParams.get("text");
  expect(text).toContain("Nome: Maria Teste");
  expect(text).toContain("Procuro: Painel de LED");
  expect(text).toContain("Mensagem: Convenção para 300 pessoas");
});

test("voltar ao topo sobe até o início e o TikTok está no rodapé", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Recusar" }).click();
  await expect(
    page.locator('.footer-clean-social a[href*="tiktok.com/@bravebearbrasil"]'),
  ).toBeAttached();
  await page
    .locator(".footer-bottom")
    .getByText("Voltar ao topo")
    .scrollIntoViewIfNeeded();
  await page.locator(".footer-bottom").getByText("Voltar ao topo").click();
  await page.waitForFunction(() => window.scrollY === 0);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test("catálogo: nove categorias com imagens distintas", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator("#equipment-categories .equipment-feature");
  await expect(cards).toHaveCount(9);
});

test("prova social exibe os seis cartões e permite ampliá-los", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.locator("#depoimentos");
  await expect(section).toBeVisible();
  await expect(section.locator(".reviews-track img")).toHaveCount(6);
  await expect(
    section.getByRole("button", { name: "Próximos depoimentos" }),
  ).toBeEnabled();
  await section
    .getByRole("link", { name: "Ampliar depoimento 1 de 6" })
    .click();
  const dialog = page.getByRole("dialog", { name: "Depoimento 1 de 6" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("img")).toHaveJSProperty("naturalWidth", 960);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("prova social aparece quando há depoimentos cadastrados", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.__seed = [
      {
        quote: "<b>Texto de teste</b>",
        name: "Ana Souza",
        role: "Gerente",
        company: "Empresa X",
        source: "Google",
      },
      { quote: "Segundo texto de teste.", name: "Beto Lima" },
    ];
  });
  await page.route("**/depoimentos-data.js*", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: "window.BRAVE_DEPOIMENTOS = window.__seed;",
    }),
  );
  await page.goto("/");
  await expect(page.locator("#depoimentos")).toBeAttached();
  await expect(page.locator("#social-grid .social-card")).toHaveCount(2);
  await expect(page.locator("#social-grid blockquote").first()).toHaveText(
    "<b>Texto de teste</b>",
  );
  await expect(page.locator("#social-grid b")).toHaveCount(0);
});
