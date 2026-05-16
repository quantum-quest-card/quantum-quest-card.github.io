import { mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import { spawn, spawnSync } from "node:child_process";
import { createReadStream, existsSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outputPath = resolve(root, "screenshots/homepage.png");
const browserCandidates = [
  "chromium",
  "chromium-browser",
  "google-chrome",
  "google-chrome-stable",
  "chrome",
  "microsoft-edge",
];

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".svg", "image/svg+xml"],
]);

function findBrowser() {
  const explicitBrowser = process.env.CHROME_PATH || process.env.BROWSER_PATH;
  if (explicitBrowser) {
    return explicitBrowser;
  }

  for (const candidate of browserCandidates) {
    const result = spawnSync("command", ["-v", candidate], { shell: true, encoding: "utf8" });
    if (result.status === 0 && result.stdout.trim()) {
      return result.stdout.trim();
    }
  }
  return undefined;
}

const browser = findBrowser();
if (!browser) {
  console.error(
    "No supported browser found. Install Chromium or Google Chrome, then run `npm run screenshot` again.",
  );
  process.exit(2);
}

const server = createServer((request, response) => {
  const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
  const pathname = decodeURIComponent(requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname);
  const filePath = resolve(join(root, pathname));

  if (!filePath.startsWith(root) || !existsSync(filePath)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, { "Content-Type": mimeTypes.get(extname(filePath)) ?? "application/octet-stream" });
  createReadStream(filePath).pipe(response);
});

await mkdir(resolve(root, "screenshots"), { recursive: true });

await new Promise((resolveServer) => {
  server.listen(0, "127.0.0.1", resolveServer);
});

const { port } = server.address();
const url = `http://127.0.0.1:${port}/index.html`;
const args = [
  "--headless",
  "--no-sandbox",
  "--disable-gpu",
  "--hide-scrollbars",
  "--window-size=1440,1200",
  `--screenshot=${outputPath}`,
  url,
];

try {
  await new Promise((resolveRun, rejectRun) => {
    const child = spawn(browser, args, { stdio: "inherit" });
    child.on("error", rejectRun);
    child.on("exit", (code) => {
      if (code === 0) {
        resolveRun();
      } else {
        rejectRun(new Error(`${browser} exited with code ${code}`));
      }
    });
  });
  console.log(`Saved screenshot to ${outputPath}`);
} finally {
  await new Promise((resolveClose) => server.close(resolveClose));
}
