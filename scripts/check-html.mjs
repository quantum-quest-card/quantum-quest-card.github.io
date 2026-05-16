import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const html = await readFile(resolve(root, "index.html"), "utf8");

const requiredSnippets = [
  "<!doctype html>",
  '<html lang="en">',
  'src="gamepackage.png"',
  "Watch the gameplay trailer",
  "Disclosure: Use of Generative AI",
];

for (const snippet of requiredSnippets) {
  if (!html.includes(snippet)) {
    throw new Error(`Missing expected snippet: ${snippet}`);
  }
}

console.log("HTML content check: OK");
