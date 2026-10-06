import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

// Products sold on our Selfany store, one Markdown file each in content/courses/.
// The file name is the URL slug: content/courses/foo.md -> /courses/foo.
// Front matter: title, kind (course | service), order, priceNGN, image, selfany (product URL), summary.

const DIR = path.join(process.cwd(), "content", "courses");

export const STORE_URL = "https://viralmonipoint.selfany.com/";

export type CourseKind = "course" | "service";

export type CourseMeta = {
  slug: string;
  title: string;
  kind: CourseKind;
  order: number;
  priceNGN: number;
  image: string;
  selfany: string;
  summary: string;
};

export type Course = CourseMeta & { html: string };

function read(slug: string): { meta: CourseMeta; body: string } {
  const { data, content } = matter(fs.readFileSync(path.join(DIR, `${slug}.md`), "utf8"));
  for (const field of ["title", "kind", "priceNGN", "image", "selfany", "summary"]) {
    if (data[field] === undefined || data[field] === "") {
      throw new Error(`content/courses/${slug}.md is missing "${field}" in its front matter`);
    }
  }
  if (!String(data.selfany).startsWith(STORE_URL)) {
    throw new Error(`content/courses/${slug}.md: "selfany" must be a product URL on ${STORE_URL}`);
  }
  return {
    meta: {
      slug,
      title: String(data.title),
      kind: data.kind === "service" ? "service" : "course",
      order: Number(data.order ?? 99),
      priceNGN: Number(data.priceNGN),
      image: String(data.image),
      selfany: String(data.selfany),
      summary: String(data.summary),
    },
    body: content,
  };
}

export function getAllCourses(): CourseMeta[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => read(f.replace(/\.md$/, "")).meta)
    .sort((a, b) => a.order - b.order);
}

export function getCourse(slug: string): Course | undefined {
  if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(path.join(DIR, `${slug}.md`))) return undefined;
  const { meta, body } = read(slug);
  return { ...meta, html: marked.parse(body, { async: false }) };
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-US")}`;
}

export const KIND_LABEL: Record<CourseKind, string> = {
  course: "Online course",
  service: "Done for you",
};
