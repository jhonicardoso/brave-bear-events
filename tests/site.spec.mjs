import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // External services are outside this deterministic local validation.
  await page.route(/^https:\/\//, (route) => route.abort());
});

for (const path of ["/", "/equipamentos.html", "/calculadora-led.html"]) {
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

test("optional interaction script loads near its section", async ({ page }) => {
  await page.goto("/");
  await page.locator("#interatividade").scrollIntoViewIfNeeded();
  await expect(page.locator('script[src="interactivity.js"]')).toHaveCount(1);
  await expect(page.locator("#interatividade")).not.toHaveAttribute(
    "data-lazy-script",
  );
  const tabs = page.locator("[data-activation]");
  await tabs.nth(1).click();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
});

test("quote text remains data and outbound link isolates opener", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator('[name="name"]').fill("<img src=x onerror=alert(1)>");
  await page.locator('[name="phone"]').fill("11999999999");
  await page.locator('#quote-form button[type="submit"]').click();
  const link = page.locator("#form-feedback a");
  await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.locator("#form-feedback img")).toHaveCount(0);
  expect(
    new URL(await link.getAttribute("href")).searchParams.get("text"),
  ).toContain("<img");
});

test("Interactive Experience Lab showcases the service and retains all three demos", async ({
  page,
}) => {
  await page.goto("/");
  const lab = page.locator("#interatividade");
  await expect(lab.locator("h2")).toContainText("Software, apps");
  await expect(lab.locator(".digital-pillars > li")).toHaveCount(3);
  await expect(lab.locator(".activation-tabs [role=tab]")).toHaveCount(3);
  await lab.scrollIntoViewIfNeeded();
  await lab.locator("#activation-tab-memory").click();
  await expect(lab.locator("#activation-panel-memory")).toBeVisible();
  await lab.locator("#activation-tab-wheel").click();
  await expect(lab.locator("#activation-panel-wheel")).toBeVisible();
  await lab.locator("#activation-tab-quiz").click();
  await expect(lab.locator("#activation-panel-quiz")).toBeVisible();
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
  await expect(
    page.getByRole("link", { name: /Comprar equipamentos/ }),
  ).toHaveAttribute("href", "equipamentos.html?categoria=venda");
  await expect(
    page.getByRole("link", { name: /Locar para meu evento/ }),
  ).toHaveAttribute("href", "#equipamentos");
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
    const note = document.querySelector(".hero-note").getBoundingClientRect();
    const foot = document.querySelector(".hero-foot").getBoundingClientRect();
    const next = document
      .querySelector(".commercial-paths")
      .getBoundingClientRect();
    return {
      heroBottom: hero.bottom,
      noteBottom: note.bottom,
      footTop: foot.top,
      nextTop: next.top,
    };
  });
  expect(positions.footTop - positions.noteBottom).toBeLessThan(150);
  expect(Math.abs(positions.nextTop - positions.heroBottom)).toBeLessThan(2);
});

test("premium totem loads and games complete without horizontal overflow", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#interatividade").scrollIntoViewIfNeeded();
  const image = page.locator(".interactive-image");
  expect(
    await image.evaluate((el) => getComputedStyle(el).backgroundImage),
  ).toContain("totem-interatividade-brave-bear.jpg?v=20261116-hd");
  const asset = await page.request.get(
    "/assets/totem-interatividade-brave-bear.jpg?v=20261116-hd",
  );
  expect(asset.ok()).toBe(true);
  const dimensions = await page.evaluate(async () => {
    const image = new Image();
    image.src = "/assets/totem-interatividade-brave-bear.jpg?v=20261116-hd";
    await image.decode();
    return { width: image.naturalWidth, height: image.naturalHeight };
  });
  expect(dimensions.width).toBeGreaterThanOrEqual(1024);
  expect(dimensions.height).toBeGreaterThanOrEqual(1024);
  for (let question = 0; question < 4; question++) {
    await page.locator("#quiz-choices button").first().click();
    await page.locator("#quiz-next").click();
  }
  await expect(page.locator("#quiz-restart")).toBeVisible();
  await page.locator("#activation-tab-memory").click();
  for (const pair of ["audio", "light", "screen"]) {
    const cards = page.locator(`[data-pair="${pair}"]`);
    await cards.nth(0).click();
    await cards.nth(1).click();
    await expect(cards.nth(1)).toHaveClass(/is-matched/);
  }
  await expect(page.locator(".is-matched")).toHaveCount(6);
  await page.locator("#activation-tab-wheel").click();
  await page.locator(".demo-spin").click();
  await expect(page.locator(".wheel-result")).toHaveClass(/is-revealed/);
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
