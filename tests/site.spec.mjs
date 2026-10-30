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
