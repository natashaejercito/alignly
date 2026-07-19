import { existsSync } from "node:fs";

/**
 * The backdrop is referenced by URL from a style, so nothing in the build fails
 * when it is missing — the page just deploys with the flat cream fallback. This
 * turns that silent gap into a visible warning at build time.
 */
// The bubble PNGs are intentionally absent from this list — the bubbles are now
// drawn in CSS (see .bubble in index.css). The exports are kept in the repo as
// the design source of truth, but nothing references them at runtime.
const required = ["public/assets/alignly-bg.png"];
const missing = required.filter((p) => !existsSync(p));

if (missing.length > 0) {
  console.warn(
    `\n\x1b[33m⚠  Missing asset${missing.length > 1 ? "s" : ""}:\x1b[0m\n` +
      missing.map((p) => `     ${p}`).join("\n") +
      `\n   The build will succeed and the page falls back to flat cream.` +
      `\n   Export from Figma into public/assets/ — see public/assets/README.md\n`,
  );
}
