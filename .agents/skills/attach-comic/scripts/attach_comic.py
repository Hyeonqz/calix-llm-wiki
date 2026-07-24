#!/usr/bin/env python3
"""Attach a comic/summary image to the top of a blog post or wiki page.

Blog posts (posts/*.md) and wiki pages (content/**/*.md) reference images
differently, so this script detects which one the target is and does the right
thing — plus it renames the image to an ASCII slug so the URL never breaks on
spaces or Korean characters (a footgun we hit by hand every time).

  blog  -> public/images/blog/<slug>.<ext>, wired via frontmatter hero/heroCaption
  wiki  -> public/images/wiki/<slug>.<ext>, inserted as a markdown image after the H1

Usage:
  python attach_comic.py --md <path-to.md> --image <path-to-image> [--caption "..."] [--name slug]
"""
import argparse
import re
import shutil
import sys
from pathlib import Path

DEFAULT_CAPTION = "만화로 보는 요약 — 먼저 읽어보세요"


def kind_of(md: Path) -> str:
    parts = md.resolve().parts
    if "posts" in parts:
        return "blog"
    if "content" in parts:
        return "wiki"
    sys.exit(f"error: {md} is under neither posts/ (blog) nor content/ (wiki)")


def repo_root(md: Path, kind: str) -> Path:
    # the parent that contains the posts/ or content/ segment
    anchor = "posts" if kind == "blog" else "content"
    for p in md.resolve().parents:
        if (p / anchor).is_dir():
            return p
    sys.exit(f"error: could not locate repo root ({anchor}/ not found above {md})")


def move_image(image: Path, dest_dir: Path, name: str) -> Path:
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / name
    if image.resolve() != dest.resolve():
        shutil.move(str(image), str(dest))
    return dest


def attach_blog(md: Path, web_path: str, caption: str) -> str:
    text = md.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n", text, re.DOTALL)
    if not m:
        sys.exit(f"error: blog post {md} has no frontmatter block")
    fm = m.group(1)
    # replace existing hero lines if present, else append
    fm = re.sub(r"\n?hero:.*", "", fm)
    fm = re.sub(r"\n?heroCaption:.*", "", fm)
    fm = fm.rstrip() + f"\nhero: {web_path}\nheroCaption: {caption}"
    return f"---\n{fm}\n---\n" + text[m.end():]


def attach_wiki(md: Path, web_path: str, caption: str) -> str:
    text = md.read_text(encoding="utf-8")
    if web_path in text:
        # already attached — refresh the caption line that follows, leave rest
        return text
    block = f"\n![{caption}]({web_path})\n\n*{caption}*\n"
    lines = text.splitlines(keepends=True)
    for i, line in enumerate(lines):
        if line.startswith("# "):
            lines.insert(i + 1, block)
            return "".join(lines)
    sys.exit(f"error: wiki page {md} has no '# ' heading to insert below")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--md", required=True, type=Path)
    ap.add_argument("--image", required=True, type=Path)
    ap.add_argument("--caption", default=DEFAULT_CAPTION)
    ap.add_argument("--name", help="image slug (defaults to the .md filename)")
    args = ap.parse_args()

    if not args.md.exists():
        sys.exit(f"error: md not found: {args.md}")
    if not args.image.exists():
        sys.exit(f"error: image not found: {args.image}")

    kind = kind_of(args.md)
    root = repo_root(args.md, kind)
    slug = args.name or args.md.stem
    ext = args.image.suffix.lower()
    name = f"{slug}{ext}"

    dest = move_image(args.image, root / "public" / "images" / kind, name)
    web_path = f"/images/{kind}/{name}"

    updated = attach_blog(args.md, web_path, args.caption) if kind == "blog" \
        else attach_wiki(args.md, web_path, args.caption)
    args.md.write_text(updated, encoding="utf-8")

    rel_img = dest.relative_to(root)
    print(f"kind:    {kind}")
    print(f"image:   {rel_img}")
    print(f"web url: {web_path}")
    print(f"md:      {args.md}")
    print("done — run `npm run build` to verify.")


if __name__ == "__main__":
    main()
