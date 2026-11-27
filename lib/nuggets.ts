import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

// Daily Nuggets: short YouTube updates (policy changes, requirement changes, success tips).
// One Markdown file per nugget in content/nuggets/, named by date: content/nuggets/2026-11-27.md -> /nuggets/2026-11-27
// (a second nugget on the same day can use a suffix, e.g. 2026-11-27-shorts.md).
//
// Front matter:
//   title, summary, date (YYYY-MM-DD), category ("Policy update" | "Requirement change" | "Success tip")
//   source, sourceLabel (optional link to YouTube's own page)
//   banner: { kicker, headline, highlight, points: [{ title, text }] }   -> used by `npm run nugget:render`
//
// Nuggets are kept for NUGGET_DAYS days. Older ones are left out of the build, hidden in the browser
// if a page outlives them, and deleted from the repo by `npm run nugget:prune`.

export const NUGGET_DAYS = 90;
const DIR = path.join(process.cwd(), "content", "nuggets");
const IMG_DIR = path.join(process.cwd(), "public", "nuggets");
const SLUG = /^\d{4}-\d{2}-\d{2}(-[a-z0-9-]+)?$/;

export type NuggetMeta = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  /** Last day the nugget is shown (date + NUGGET_DAYS), YYYY-MM-DD. */
  expires: string;
  category: string;
  source?: string;
  sourceLabel?: string;
  /** Public paths of the shareable images, when they have been rendered. */
  feedImage?: string;
  storyImage?: string;
};

export type Nugget = NuggetMeta & { html: string };

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function read(slug: string): { meta: NuggetMeta; body: string } {
  const { data, content } = matter(fs.readFileSync(path.join(DIR, `${slug}.md`), "utf8"));
  for (const field of ["title", "summary", "date"]) {
    if (!data[field]) throw new Error(`content/nuggets/${slug}.md is missing "${field}" in its front matter`);
  }
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date);
  const img = (kind: string) => (fs.existsSync(path.join(IMG_DIR, `${slug}-${kind}.png`)) ? `/nuggets/${slug}-${kind}.png` : undefined);
  return {
    meta: {
      slug,
      title: String(data.title),
      summary: String(data.summary),
      date,
      expires: addDays(date, NUGGET_DAYS),
      category: data.category ? String(data.category) : "Success tip",
      source: data.source ? String(data.source) : undefined,
      sourceLabel: data.sourceLabel ? String(data.sourceLabel) : undefined,
      feedImage: img("feed"),
      storyImage: img("story"),
    },
    body: content,
  };
}

/** Nuggets from the last NUGGET_DAYS days (none dated in the future), newest first. */
export function getActiveNuggets(): NuggetMeta[] {
  if (!fs.existsSync(DIR)) return [];
  const now = today();
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md") && SLUG.test(f.replace(/\.md$/, "")))
    .map((f) => read(f.replace(/\.md$/, "")).meta)
    .filter((n) => n.date <= now && n.expires >= now)
    .sort((a, b) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug));
}

export function getNugget(slug: string): Nugget | undefined {
  if (!getActiveNuggets().some((n) => n.slug === slug)) return undefined;
  const { meta, body } = read(slug);
  return { ...meta, html: marked.parse(body, { async: false }) };
}

/**
 * Inline script that hides nuggets whose 90 days are up, for when the static site hasn't been rebuilt yet.
 * Elements with data-expires="YYYY-MM-DD" are removed once that day has passed.
 */
export const EXPIRY_SCRIPT = `(function(){var t=new Date().toISOString().slice(0,10);document.querySelectorAll('[data-expires]').forEach(function(el){if(el.getAttribute('data-expires')<t){if(el.hasAttribute('data-expired-redirect')){location.replace('/nuggets');}else{el.remove();}}});})();`;
