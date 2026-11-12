# Project Instructions

## Git commits

- Usually work directly on `main` because this is a single-user repository. Use another branch when the user requests it or the task requires isolation.
- Do not offer or perform `git commit` unless explicitly asked.
- Do not suggest committing changes at the end of a task.
- When the user explicitly asks for commits or a push, use `main` unless they request another branch; this overrides commit-skill rules requiring a feature branch.
- Otherwise, when changes are ready, stop at `chezmoi apply` or file edits - the user will commit manually.

## Global skills

- After installing, updating, moving, or removing global skills, follow [Global skills](readme.md#global-skills) to sync targets and refresh the owning installer's metadata in chezmoi.
- Preserve each skill's current installer ownership unless the user requests a migration.
