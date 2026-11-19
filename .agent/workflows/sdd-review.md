---
description: Independent review of a user story (EPICX/USn) or of an epic spec (spec EPICX).
---

Run the independent review defined in `skills/review/SKILL.md`.

Target: whatever the user wrote after the command (`EPICX/USn`, or `spec EPICX`). If empty, the user story currently in review.

1. Collect file pointers: the epic file, its `PLAN.md` and `TASKS.md`, `docs/ARCHITECTURE.md`, and the files changed for this user story (`git status --porcelain`, `git diff --name-only`).
2. Invoke the `sdd-reviewer` subagent, passing only the target and those paths. Never pass a summary of the work: the reviewer must read the files itself.
3. If subagents are not available, tell the PM to run the review in a new conversation; do not review your own work in this context.
4. Show the verdict and the numbered findings, then continue with the Review section of `docs/METHODOLOGY.md`. Fixing findings is your job, not the reviewer's.
