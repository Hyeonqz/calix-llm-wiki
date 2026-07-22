---
name: commit
description: Stage modified wiki files and create a structured commit following the project commit protocol. Use when the user wants to commit current changes WITHOUT pushing.
---

# /commit

Stage current wiki changes and create a commit. **Do not push** — `/push` is a separate skill.

## Steps

1. Inspect state in parallel (single message, multiple Bash calls):
   - `git status` — working tree
   - `git diff --stat` — what changed
   - `git log --oneline -5` — match the project's commit message style
2. Stage relevant files **explicitly** by path. Inspect what you're staging — never blindly batch.
3. Draft a commit message:
   - **Subject**: `<type>(<scope>): <subject>` (≤ 70 chars)
     - For wiki content: usually `docs(<domain>): ...` (e.g. `docs(Codex): ingest hooks chapter`)
     - Common types: `docs`, `feat`, `fix`, `refactor`, `chore`
   - **Body** (optional): explain the *why*, not the *what* (the diff shows the what)
   - **Trailers** (only when applicable — skip for typo fixes / formatting):
     - `Constraint:` active constraint that shaped this decision
     - `Rejected:` alternative considered | reason for rejection
     - `Confidence:` `high` / `medium` / `low`
     - `Scope-risk:` `narrow` / `moderate` / `broad`
     - `Directive:` warning for future modifiers
     - `Not-tested:` edge case not covered
4. Create the commit with HEREDOC and the standard co-author trailer:
   ```bash
   git commit -m "$(cat <<'EOF'
   <subject>

   <body>

   <trailers>

   Co-Authored-By: Codex Opus 4.6 <noreply@anthropic.com>
   EOF
   )"
   ```
5. Run `git status` to confirm the commit landed cleanly.

## Constraints

- **NEVER push** — that's `/push`'s job
- **NEVER** `git add -A` / `git add .` — could include `.env`, secrets, large binaries
- **NEVER** `--no-verify`, `--no-gpg-sign`, or `--amend` (use a NEW commit if a hook fails)
- **If a pre-commit hook fails**: the commit did NOT happen. Fix the underlying issue, re-stage, create a NEW commit. Do not amend.
- **If there's nothing to commit**: tell the user and stop. Do not create empty commits.
- **If files look sensitive** (`.env`, `credentials.json`, etc.): warn the user before staging.

## Style anchor

Recent wiki commits follow this pattern (use `git log` to confirm before drafting):

```
docs(Codex): ingest WikiDocs foundations into new domain
fix: proper light/dark mode support
refactor: restructure wiki to Dendron hierarchy + MOC index pattern
```
