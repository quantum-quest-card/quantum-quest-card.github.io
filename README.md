# quantum-quest-card.github.io

## Development checks

Run a lightweight content check for the static homepage:

```sh
npm run check:html
```

## Screenshot capture

This repository includes a helper script for capturing the homepage screenshot:

```sh
npm run screenshot
```

The script starts a local static server, opens `index.html` in a headless Chromium-compatible browser, and writes the image to `screenshots/homepage.png`.

A Chromium-compatible browser must be available on the system PATH. Supported command names include `chromium`, `chromium-browser`, `google-chrome`, `google-chrome-stable`, `chrome`, and `microsoft-edge`.

### GitHub Actions

Screenshot capture also runs in GitHub Actions on pushes to `main` and can be started manually from the Actions tab. The workflow installs Node.js 20, runs `npm ci`, provisions Chrome, runs `npm run screenshot`, and uploads `screenshots/homepage.png` as an artifact.
