---
name: commit
description: Group uncommitted changes into logical commits, push them safely, then optionally create or synchronize a pull request. Use when the user asks to commit, push, or land a batch of changes.
---

# Commit Changes

## Approval and safety

- Inspect the current branch, working-tree status, diff, and recent commits before planning.
- Present the full commit plan, including exact paths, messages, branch action, and any proposed PR details, before staging anything.
- Obtain explicit approval through the approval dialog below before staging anything. Never proceed on silence.
- Treat `main` as protected. Never commit or push directly to it. Create a feature branch with `git switch -c` only after the user approves its name.
- Stage only the paths belonging to each approved logical commit. Do not use `git add -A` or stage the entire working tree.
- Do not amend, force-push, reset, discard changes, or create or edit a PR without explicit user approval.

## Approval dialog

For every new or revised commit plan that needs approval, always show an interactive approval dialog after presenting the full plan. Combine approval of the commits and push with the PR choice in one question. Use `request_user_input_async` when available, or an equivalent interactive input tool supported by the current mode. If no interactive tool is available, ask the same question and list the choices in plain text.

Make the question self-contained: identify the branch and the proposed commits, and ask the user to approve the plan and choose what happens to the PR. Use the user's language.

When no PR exists, offer these three choices:

- Approve commits and push, without a PR.
- Approve commits, push and a PR ready for review.
- Approve commits, push and a draft PR.

When a PR already exists, offer approval of commits and push either with the proposed PR updates or with the PR left unchanged. Preserve its draft state unless the user explicitly approves changing it.

Treat the selected choice as authorization only for the presented plan and PR action. Wait for an explicit answer before staging, committing, pushing, or changing the PR. A preselected option or elapsed time is not approval. Once the user approves the plan, execute it without asking for the same approval again; ask again only if the plan changes materially. A request to change this skill does not approve any pending repository commit plan.

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
3. If no PR exists, determine the default branch with `gh repo view --json defaultBranchRef -q .defaultBranchRef.name`. Include the proposed base branch, title and body in the full plan, then use the approval dialog to choose a PR ready for review, a draft PR, or no PR.
4. Write generated PR titles and bodies to temporary files before passing them to `gh pr edit` or `gh pr create`, so shell-special characters remain literal.
5. Report the pushed branch and PR URL, or explicitly state that PR creation or updates were skipped.
