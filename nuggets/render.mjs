// Renders the shareable images for a Daily Nugget from its front matter `banner` block.
//   npm run nugget:render              -> today's nugget (by local date)
//   npm run nugget:render 2026-11-27   -> a specific nugget (file name without .md)
// Writes public/nuggets/<slug>-feed.png (1080x1350, 4:5 post) and <slug>-story.png (1080x1920, story/status).
// Needs Microsoft Edge (Windows). Set EDGE_PATH to use another Chromium browser.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import matter from "gray-matter";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(here);
const local = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const slug = process.argv[2] ?? local;
const mdPath = path.join(root, "content", "nuggets", `${slug}.md`);
if (!fs.existsSync(mdPath)) throw new Error(`No nugget at content/nuggets/${slug}.md`);

const { data } = matter(fs.readFileSync(mdPath, "utf8"));
const b = data.banner;
if (!b?.headline || !Array.isArray(b.points)) throw new Error(`${slug}.md needs a banner: { headline, points } block`);

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const date = data.date instanceof Date ? data.date : new Date(`${data.date}T00:00:00Z`);
const dateLabel = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).toUpperCase();
const points = b.points
  .map((p, i) => `<div class="pt"><div class="n">${String(i + 1).padStart(2, "0")}</div><div><h2>${esc(p.title)}</h2><p>${esc(p.text)}</p></div></div>`)
  .join("");

const template = fs.readFileSync(path.join(here, "banner-template.html"), "utf8");
const edge = process.env.EDGE_PATH ?? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const outDir = path.join(root, "public", "nuggets");
fs.mkdirSync(outDir, { recursive: true });

for (const [mode, height] of [["feed", 1350], ["story", 1920]]) {
  const html = template
    .replace("{{MODE}}", mode)
    .replace("{{GHOST}}", esc(b.ghost ?? b.points.length))
    .replace("{{DATE}}", esc(dateLabel))
    .replace("{{KICKER}}", esc(b.kicker ?? "Today's YouTube nugget"))
    .replace("{{HEADLINE}}", esc(b.headline))
    .replace("{{HIGHLIGHT}}", esc(b.highlight ?? ""))
    .replace("{{POINTS}}", points);
  const tmp = path.join(here, `.render-${mode}.html`);
  fs.writeFileSync(tmp, html);
  const out = path.join(outDir, `${slug}-${mode}.png`);
  try {
    execFileSync(edge, ["--headless", "--disable-gpu", "--hide-scrollbars", `--window-size=1080,${height}`,
      "--virtual-time-budget=3000", `--screenshot=${out}`, pathToFileURL(tmp).href], { stdio: "ignore", timeout: 60000 });
  } finally {
    fs.rmSync(tmp, { force: true });
  }
  console.log(`wrote public/nuggets/${slug}-${mode}.png`);
}
