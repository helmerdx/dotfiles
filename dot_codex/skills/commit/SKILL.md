---
name: commit
description: Group uncommitted changes into logical commits, request interactive confirmation, then execute the approved commits, push, and optional pull request actions. Use when the user asks to commit, push, or land a batch of changes.
---

# Commit Changes

## Approval and safety

- Inspect the current branch, working-tree status, diff, and recent commits before planning.
- Present the full commit plan, including exact paths, messages, branch action, and any proposed PR details, before staging anything.
- Obtain explicit approval through the approval dialog below before staging anything. Never proceed on silence.
- Follow the repository's branch instructions, including permission to work directly on `main`. Otherwise, treat `main` as protected and propose a feature branch before committing or pushing. Include any branch creation in the approval plan.
- Stage only the paths belonging to each approved logical commit. Do not use `git add -A` or stage the entire working tree.
- Do not amend, force-push, reset, discard changes, or create or edit a PR without explicit user approval.

## Approval dialog

For every new or materially revised commit plan, present the full plan and then invoke the interactive input tool. Mentioning a dialog in prose does not display one. Use this order:

1. Call `functions.request_user_input_async` (or the same tool under its exposed namespace) when available. Put the question in `questions[].title` and the choices in `questions[].options`.
2. Otherwise, use an interactive input tool only if its current tool instructions permit confirmation requests in the active mode. In particular, do not call a Plan-only tool from Default mode or use a tool that forbids approval requests.
3. If no permitted interactive tool is available, ask the confirmation question in the final response and wait for the user's next message. Explain that this session does not expose a supported confirmation dialog.

An asynchronous tool's `accepted: true` response only means the question was submitted. Keep the turn open until the user answers or cancels the popup. Do not send a final response or end the turn while confirmation is pending: the host may close an unanswered popup when the turn ends. While waiting, perform only independent read-only work. When there is nothing left to inspect, use an available interruptible wait tool, such as `clock.sleep` in intervals of at most 30 seconds, and continue waiting after each interval. Give a brief commentary update at least every 60 seconds while waiting; do not dismiss or resubmit the popup just because time has passed.

Silence, a timeout, a preselected option, or automatic tool approval never authorizes a commit. If the user cancels or the host closes the popup without an answer, leave the plan unapproved. Do not use shell permission escalation to manufacture a confirmation popup; automatic approval review may answer those requests without asking the user.

Make the question self-contained: identify the branch and proposed commits, and ask the user to choose which actions to authorize. Use the user's language. Explain briefly that this skill requires confirmation before staging. Prepare the plan and any proposed PR title and body before asking; confirmation is the last step before execution.

Offer the applicable choices below through the popup, keeping within the tool's option limit. If the user requested commits without mentioning a push or PR, recommend committing locally. An optional push or PR is authorized only when the user explicitly selects it.

- Commit locally only.
- Commit and push, leaving the PR unchanged or creating none.
- Commit, push, and create or update the PR as proposed, when applicable.

Include a hold or revise choice when the tool allows it; otherwise explain that the user can enter a revision in the free-text response or cancel. For a new PR, specify ready for review or draft in the proposed plan and the PR choice. When both PR states are relevant and the tool allows enough options, offer them separately; otherwise resolve the state before the final confirmation. For an existing PR, preserve its draft state unless the user explicitly approves changing it.

Treat the selected choice as authorization only for the presented plan and selected actions. After approval, execute that plan without repeating the same question. Ask again only when the plan changes materially; if the user requests revisions, update the plan before asking. A request to change or validate this skill does not approve any repository commit plan.

## Branch naming

When a feature branch is needed, propose `<type>-<short-slug>` using the session's work context. Get approval before creating it.

## Commit workflow

1. Read the diff and group files by one logical concern, such as feature, bug fix, refactor, configuration, documentation, or tests. Assign each file to exactly one group.
2. Propose a message for each group using `<type>: <description>`.
3. Present the plan and invoke the approval dialog. After approval, recheck status and the diff for changes to the approved contents, then stage and commit each group in order with its exact approved paths and message. Reconfirm materially changed contents before staging them.
4. If the user approved pushing, recheck the current branch. Verify it matches the approved plan and the repository's branch instructions.
5. Push only when approved. Use `git push -u origin <branch>` when it has no upstream; otherwise use `git push`. Stop after the local commits when the user chose commit only.

## Pull request workflow

1. When a PR action is relevant to the user's request or the proposed choices, check whether the current branch already has a PR with `gh pr view --json number,title,body,baseRefName,url`. Propose PRs only for a branch that can be merged into the base branch.
2. For an existing PR, propose a concise title and a short body grouped by commit concern. Compare them with the current values and edit only fields that changed, after approval.
3. If no PR exists, determine the default branch with `gh repo view --json defaultBranchRef -q .defaultBranchRef.name`. Include the proposed base branch, title, body, and draft state in the full plan before the approval dialog.
4. Write generated PR titles and bodies to temporary files before passing them to `gh pr edit` or `gh pr create`, so shell-special characters remain literal.
5. Report the created commit hashes, whether a push occurred, and the PR URL when applicable.
