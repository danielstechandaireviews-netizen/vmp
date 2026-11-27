// Deletes Daily Nuggets older than 90 days (their Markdown and images).
//   npm run nugget:prune
// The site already stops showing them after 90 days; this keeps the repo tidy.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DAYS = 90; // keep in sync with NUGGET_DAYS in lib/nuggets.ts
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const md = path.join(root, "content", "nuggets");
const img = path.join(root, "public", "nuggets");

const cutoff = new Date();
cutoff.setUTCDate(cutoff.getUTCDate() - DAYS);
const cut = cutoff.toISOString().slice(0, 10);

let removed = 0;
for (const dir of [md, img]) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    const d = f.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
    if (d && d < cut) {
      fs.rmSync(path.join(dir, f));
      console.log(`deleted ${path.relative(root, path.join(dir, f))}`);
      removed++;
    }
  }
}
console.log(removed ? `${removed} file(s) older than ${cut} removed.` : `Nothing older than ${cut}.`);
