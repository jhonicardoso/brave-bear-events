import { readFile, readdir, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";

const scripts = (await readdir(".")).filter((file) => file.endsWith(".js"));
let bytes = 0;
for (const file of scripts) {
  execFileSync(process.execPath, ["--check", file], { stdio: "inherit" });
  bytes += (await stat(file)).size;
}
// Budget covers every browser entrypoint, without relying on network timing.
if (bytes > 160_000)
  throw new Error(`Browser JS budget exceeded: ${bytes} > 160000 bytes`);
for (const file of [
  "index.html",
  "equipamentos.html",
  "calculadora-led.html",
]) {
  const html = await readFile(file, "utf8");
  for (const match of html.matchAll(
    /(?:src|href)="([^"#?]+)(?:[?#][^"]*)?"/g,
  )) {
    const resource = match[1];
    if (/^(?:https?:|mailto:|tel:|data:)/.test(resource)) continue;
    await stat(resource);
  }
}
console.log(
  `Syntax, HTML resources and JS budget passed (${bytes}/160000 bytes).`,
);
