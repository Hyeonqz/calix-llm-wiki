---
name: push
description: Push committed wiki changes to the remote. Use after /commit when ready to publish, or when there are unpushed commits already.
---

# /push

Push the current branch to its configured upstream.

## Steps

1. Inspect state in parallel:
   - `git status` — verify nothing surprising
   - `git log @{u}..HEAD --oneline` — list commits that will be pushed
   - `git rev-parse --abbrev-ref HEAD` — confirm current branch
2. **If there are no commits ahead of upstream**: tell the user "이미 origin과 동기화 상태입니다" and stop.
3. Push: `git push` (let git use the configured upstream — don't hardcode `origin main`).
4. Report the push range, e.g.:
   ```
   Pushed: 4593f0c..9fe993c main -> main (3 commits)
   ```

## Constraints

- **NEVER force push** to `main` / `master` without explicit user confirmation in the same turn
- **NEVER** `--no-verify`
- **If push is rejected** (remote ahead): STOP and report. Do **not** auto-pull, rebase, or merge — ask the user how to proceed (rebase? merge? force?).
- **If the branch has no upstream**: report it and ask the user whether to set one (`git push -u origin <branch>`).
- Uncommitted changes in the working tree are fine — push only pushes commits, not the working tree. Do not block on them, just mention them in the report.
