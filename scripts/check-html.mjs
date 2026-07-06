import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

const pages = [
  {
    file: "index.html",
    snippets: [
      "<!doctype html>",
      '<html lang="en">',
      'src="gamepackage.png"',
      "Watch the gameplay trailer",
      "Use of Image-Generating AI",
    ],
  },
  {
    file: "index-ja.html",
    snippets: [
      "<!doctype html>",
      '<html lang="ja">',
      '<h2 id="news-heading">ニュース</h2>',
      '<time class="news-date" datetime="2026-07-06">2026年7月6日</time>',
      "ハワイ大学マノア校数学科のイベント「Quantum Week in Hawaii」 でQuantum Quest英語版セッションを実施しました",
      "news/quantum-week-in-hawaii-ja.html",
    ],
  },
  {
    file: "news/quantum-week-in-hawaii-ja.html",
    snippets: [
      "<!doctype html>",
      '<html lang="ja">',
      '<time class="article-date" datetime="2026-07-06">2026年7月6日</time>',
      "ハワイ大学マノア校数学科のイベント「Quantum Week in Hawaii」 でQuantum Quest英語版セッションを実施しました",
      "Quantum Quest英語版セッションを実施しました",
      "../playimage1.JPG",
      "../playimage2.jpg",
    ],
  },
];

for (const { file, snippets } of pages) {
  const html = await readFile(resolve(root, file), "utf8");

  for (const snippet of snippets) {
    if (!html.includes(snippet)) {
      throw new Error(`${file} is missing expected snippet: ${snippet}`);
    }
  }
}

console.log("HTML content check: OK");
