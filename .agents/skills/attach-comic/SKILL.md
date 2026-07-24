---
name: attach-comic
description: Attach a comic/webtoon/summary image to the top of a blog post or wiki page in this Nextra wiki. Use this whenever the user wants to put an image (especially a "만화"/comic/webtoon summary) at the top of a markdown file so readers see the visual summary before the text — e.g. "이 이미지를 이 md 상단에 만화로 붙여줘", "attach this webtoon to the blog post", "add this summary image to the top of the transaction page". Handles the blog-vs-wiki difference (frontmatter hero vs markdown image) and the ASCII rename automatically. Trigger even if the user just gives a markdown file and an image and says "붙여줘"/"attach".
---

# attach-comic

Put a comic/summary image at the top of a blog post or wiki page. Readers see the
visual summary first, then the content.

## Why a script

The two content types reference images differently, and the image always needs an
ASCII rename (spaces / Korean in filenames break the served URL). Doing it by hand
means re-deriving the branch every time, so it's bundled:

- **Blog post** (`posts/*.md`) → image to `public/images/blog/`, wired via frontmatter
  `hero:` + `heroCaption:` (rendered as a styled hero figure by `app/blog/[slug]/page.jsx`).
- **Wiki page** (`content/**/*.md`) → image to `public/images/wiki/`, inserted as a
  markdown image + italic caption right after the `# ` heading (Nextra renders it,
  optimizing through next/image).

## Steps

1. Identify the two inputs from the user: the target **markdown file** and the
   **image**. If either is missing, ask. The image can live anywhere (Downloads,
   `public/images/…`, wherever) — the script moves it into place.

2. Run the script from the repo root:

   ```bash
   python3 .Codex/skills/attach-comic/scripts/attach_comic.py \
     --md <path/to.md> --image <path/to/image> [--caption "..."]
   ```

   - It auto-detects blog vs wiki from the path, renames the image to the md's slug
     (`transaction-isolation-levels.md` → `transaction-isolation-levels.png`), moves
     it under `public/images/{blog,wiki}/`, and edits the markdown.
   - `--caption` overrides the default `만화로 보는 요약 — 먼저 읽어보세요`.
   - `--name` overrides the image slug if you don't want it derived from the filename.
   - Re-running is safe: a blog `hero` is replaced in place; a wiki page already
     referencing the image is left untouched.

3. Verify with a build so the image path actually resolves:

   ```bash
   npm run build 2>&1 | tail -6
   ```

   Exit code 0 and no missing-image errors means it's wired. For a stronger check,
   grep the built page for the image (blog keeps `/images/blog/…`; wiki rewrites to
   `/_next/image?url=…<slug>`).

4. Report what changed (kind, image path, web url, md file). Offer to commit via
   `/commit-push` if the user wants it shipped.

## Notes

- Only `posts/` and `content/` are valid targets; anything else is an error by design.
- If the user hands over a batch ("붙여줘, 다 상단에"), loop the script per pair.
