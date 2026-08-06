---
name: commit-global
description: Group uncommitted changes into logical commits, push them safely, then optionally create or synchronize a pull request. Use when the user asks to commit, push, or land a batch of changes.
---

# Commit Changes

## Approval and safety

- Inspect the current branch, working-tree status, diff, and recent commits before planning.
- Present the full commit plan, including exact paths, messages, branch action, and any proposed PR details, before staging anything.
- Obtain explicit approval using the available approval-prompt tool. If unavailable, ask a direct, clear user question. Never proceed on silence.
- Treat `main` as protected. Never commit or push directly to it. Create a feature branch with `git switch -c` only after the user approves its name.
- Stage only the paths belonging to each approved logical commit. Do not use `git add -A` or stage the entire working tree.
- Do not amend, force-push, reset, discard changes, or create or edit a PR without explicit user approval.

## Branch naming

When starting on `main`, propose `<type>-<short-slug>` using the session's work context. Get approval before creating it.

## Commit workflow

1. Read the diff and group files by one logical concern, such as feature, bug fix, refactor, configuration, documentation, or tests. Assign each file to exactly one group.
2. Propose a message for each group using `<type>: <description>`.
3. After approval, stage and commit each group in order with its exact approved paths and message.
4. Recheck the current branch before pushing. Stop and explain if it is `main`.
5. Push the feature branch. Use `git push -u origin <branch>` when it has no upstream; otherwise use `git push`.

## Pull request workflow

1. Check whether the current branch already has a PR with `gh pr view --json number,title,body,baseRefName,url`.
2. For an existing PR, propose a concise title and a short body grouped by commit concern. Compare them with the current values and edit only fields that changed, after approval.
3. If no PR exists, determine the default branch with `gh repo view --json defaultBranchRef -q .defaultBranchRef.name`. Propose the base branch, title, body, and draft state, then explicitly ask whether to create it, create it as a draft, or stop after the push.
4. Write generated PR titles and bodies to temporary files before passing them to `gh pr edit` or `gh pr create`, so shell-special characters remain literal.
5. Report the pushed branch and PR URL, or explicitly state that PR creation or updates were skipped.
