# Daily Nuggets

Live at `/nuggets`. Each nugget stays up for 90 days.

## Post today's nugget

1. Copy `content/nuggets/2026-11-27.md` to `content/nuggets/<today's date>.md` (for example `2026-11-28.md`) and edit it:
   - `title`, `summary`, `date`, `category` (`Policy update`, `Requirement change` or `Success tip`)
   - `source` / `sourceLabel`: link to YouTube's own page for policy or requirement news
   - `banner`: the text for the shareable image (`kicker`, `headline`, `highlight`, and 1 to 3 `points`)
   - The body below the `---` is the full nugget, in Markdown.
2. Make the images: `npm run nugget:render` (today) or `npm run nugget:render 2026-11-28`.
   This writes `public/nuggets/<date>-feed.png` (4:5 post) and `<date>-story.png` (9:16 story/status).
3. Commit and push. Vercel rebuilds and the nugget goes live.

## The 90-day rule

- The build only includes nuggets from the last 90 days, so expired ones drop off at the next deploy.
- If the site hasn't been rebuilt, the page hides expired nuggets in the browser anyway.
- `npm run nugget:prune` deletes expired Markdown files and images from the repo. Run it now and then, then commit.
