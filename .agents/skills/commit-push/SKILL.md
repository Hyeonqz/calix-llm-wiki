---
name: commit-push
description: Stage, commit, and push wiki changes in one shot. Use when the user wants to publish current work immediately.
---

# /commit-push

Run `/commit` then `/push` sequentially. This is the "ship it" shortcut.

## Steps

1. **Execute the full `/commit` skill protocol** (see `.Codex/skills/commit/SKILL.md`):
   - Inspect state, stage explicitly, draft message, commit with trailers
2. **Only if the commit succeeded**, execute the `/push` skill protocol:
   - Verify upstream, push, report range
3. **Final report** — single combined message:
   ```
   ✅ Commit: <hash> <subject>
   ✅ Push:   <old>..<new> <branch> -> origin/<branch>
   ```

## Constraints

- All `/commit` and `/push` constraints apply unchanged
- **If commit fails**: do NOT push. Report the failure and stop (the working tree is untouched beyond staging).
- **If push fails after a successful commit**: the commit is preserved locally. Clearly tell the user the local state and what would be needed to push later.
- **Do not collapse the two phases**: still run the inspect → stage → commit cycle of `/commit` properly. Don't shortcut to `git commit -am` etc.
