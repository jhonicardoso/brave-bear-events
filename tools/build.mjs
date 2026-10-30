import { cp, mkdir, rm } from "node:fs/promises";

// Explicit allowlist prevents .git, dependencies, reports and secrets reaching Pages.
const files = [
  "index.html",
  "equipamentos.html",
  "calculadora-led.html",
  "styles.css",
  "equipamentos.css",
  "interactivity.css",
  "enhancements.css",
  "script.js",
  "calculator.js",
  "catalog-data.js",
  "equipamentos.js",
  "interactivity.js",
  "enhancements.js",
  "assets",
  "CNAME",
  ".nojekyll",
  "robots.txt",
  "sitemap.xml",
  "catalogo-audiovisual.pdf",
];
await rm(new URL("../dist/", import.meta.url), {
  recursive: true,
  force: true,
});
await mkdir(new URL("../dist/", import.meta.url), { recursive: true });
for (const file of files) {
  await cp(
    new URL(`../${file}`, import.meta.url),
    new URL(`../dist/${file}`, import.meta.url),
    { recursive: true },
  );
}
