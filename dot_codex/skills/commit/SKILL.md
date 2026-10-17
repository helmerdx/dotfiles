---
name: commit
description: Group uncommitted changes into logical commits, request interactive confirmation, then execute the approved commits, push, and optional pull request actions. Use when the user asks to commit, push, or land a batch of changes.
---

# Commit Changes

## Approval and safety

- Inspect the current branch, staged and unstaged diffs, untracked files, recent commits, upstream, and push destination before planning. Account for existing staged changes without silently including or unstaging them.
- Present the full commit plan, including exact paths (and hunks when a file spans concerns), messages, branch action, validation results, push destination, and any proposed PR details, before staging anything. Identify changes left out of the plan.
- Obtain explicit approval through the approval dialog below before staging anything. Never proceed on silence.
- Follow the repository's branch instructions, including permission to work directly on `main`. Otherwise, treat `main` as protected and propose a feature branch before committing or pushing. Include any branch creation in the approval plan.
- Stage only the paths belonging to each approved logical commit. Do not use `git add -A` or stage the entire working tree.
- Do not amend, force-push, reset, discard changes, or create or edit a PR without explicit user approval.

## Prepare the options

- Resolve the push remote and destination branch from repository instructions and Git configuration. Do not assume `origin` when multiple remotes or a different push target are configured. Resolve ambiguity before final approval.
- Check whether the destination branch exists on that remote, using `git ls-remote --heads <remote> refs/heads/<branch>` or an equivalent read-only check. A missing upstream alone does not mean the branch is unpublished. Treat network or authentication failures as unknown state, not as an absent branch.
- When the destination branch is absent, explicitly offer to publish it and set its upstream. Label the default action `🌱 Commit and publish branch (Recommended)` and identify the remote and branch in the plan.
- Include any existing local commits that the push would publish, not just the commits being created. Check the remote state and divergence before recommending a push; stop for a revised plan if integration or history changes are needed.
- Determine whether a PR already exists and whether the provider, repository, permissions, and available tooling support PR creation and drafts. Use the host's supported tooling; the GitHub-specific commands are below. Offer only actions that are available. If support is uncertain, explain the limitation before approval; never silently replace a draft with a ready PR.
- Complete the relevant repository checks before confirmation, reusing current results when the contents have not changed. Report failed or unavailable checks in the plan; follow any repository rules that block committing or pushing.

## Approval dialog

Adapt the available actions, labels, and recommendation to the repository's actual state and the user's explicit scope. The menus below are conditional examples, not a fixed set of actions. Use the conversation's predominant language for all user-facing dialog text, including the question, action labels, descriptions, and recommendation marker. If the conversation is mostly Spanish, display these in Spanish even though this skill and its examples are written in English. Follow an explicit language preference when provided, and retain familiar Git terms such as commit, push, PR, and draft when natural. Keep paths, refs, commands, and proposed commit messages literal; commit messages follow repository conventions.

For every new or materially revised commit plan, present the full plan and then invoke the interactive input tool. Mentioning a dialog in prose does not display one. Use this order:

1. Call `functions.request_user_input_async` (or the same tool under its exposed namespace) when available. Put the question in `questions[].title` and the choices in `questions[].options`. This popup supplies native option numbers: start each option string with its emoji, such as `🚀 Commit and push (Recommended)`, without adding a numeric prefix.
2. Otherwise, use an interactive input tool only if its current tool instructions permit confirmation requests in the active mode. In particular, do not call a Plan-only tool from Default mode or use a tool that forbids approval requests.
3. If no permitted interactive tool is available, ask the confirmation question in the final response and wait for the user's next message. Explain that this session does not expose a supported confirmation dialog.

An asynchronous tool's `accepted: true` response only means the question was submitted. Keep the turn open until the user answers or cancels the popup. Do not send a final response or end the turn while confirmation is pending: the host may close an unanswered popup when the turn ends. While waiting, perform only independent read-only work. When there is nothing left to inspect, use an available interruptible wait tool, such as `clock.sleep` in intervals of at most 30 seconds, and continue waiting after each interval. Give a brief commentary update at least every 60 seconds while waiting; do not dismiss or resubmit the popup just because time has passed.

Silence, a timeout, a preselected option, or automatic tool approval never authorizes a commit. If the user cancels or the host closes the popup without an answer, leave the plan unapproved. Do not use shell permission escalation to manufacture a confirmation popup; automatic approval review may answer those requests without asking the user.

Make the question self-contained: identify the branch and proposed commits, and ask the user to choose which actions to authorize. Keep the action emojis shown below when translating labels. Keep visible sequential numbers before each action's emoji and explicit text. Use the dialog's native numeric selectors when available; add literal numbers only in an unnumbered interface or the plain-text fallback. Display each number once and number only the available actions from 1. Accept a numeric reply as selection of the corresponding action in the latest pending question; claim keyboard shortcuts only when supported by the tool. Explain briefly that this skill requires confirmation before staging. Prepare the plan and any proposed PR title and body before asking; confirmation is the last step before execution.

For an ordinary commit request, offer these applicable choices in this order. Put `🚀 Commit and push (Recommended)` first so it is the default preselected option when the UI supports preselection. Recommendation is not authorization.

1. `🚀 Commit and push (Recommended)` - push the approved commits without creating a PR or editing PR metadata. Use the publish-branch label above when appropriate.
2. `📬 Commit, push, and create PR` - create the proposed PR ready for review, when supported and no open PR exists.
3. `📝 Commit, push, and create draft PR` - create the proposed draft PR, when supported and no open PR exists.
4. `💾 Commit locally only` - create the approved commits without pushing or changing any PR.
5. `⏸️ Revise or cancel` - adjust the plan or leave everything unchanged, when the tool allows another option.

Honor explicit scope: if the user says local only or no PR, limit the choices accordingly and recommend the matching action. When pushing is unavailable, put the applicable local action first and explain why. If the tool has too few slots, resolve PR preferences in a preliminary question, then offer commit and push first, the specific PR action, and commit locally in the final approval. Keep all mutations pending until the complete plan and final action are approved. Free-text replies and cancellation can handle revisions without consuming an option slot.

For an existing PR, say that pushing updates its commits automatically. The default push option preserves its title, body, and draft state. Replace the create-PR choices with `🔄 Commit, push, and update PR details` only when a metadata update is proposed; include the exact changes and URL. A draft-state change requires explicit approval.

Treat the selected choice as authorization only for the presented plan and selected actions. After approval, execute that plan without repeating the same question. Ask again only when the plan changes materially; if the user requests revisions, update the plan before asking. A request to change or validate this skill does not approve any repository commit plan.

## Branch naming

When a feature branch is needed, propose `<type>-<short-slug>` using the session's work context. Get approval before creating it.

## Commit workflow

1. Read the diff and group changes by one logical concern, such as feature, bug fix, refactor, configuration, documentation, or tests. Split hunks when one file contains independent concerns; otherwise keep the file together. Account for every included change exactly once.
2. Propose a message for each group using the repository's conventions, falling back to `<type>: <description>` when none exist.
3. Prepare the options, present the plan, and invoke the approval dialog. After approval, recheck the branch, status, index, and diff for changes to the approved contents. Stage each group with exact paths or hunks, inspect the staged diff, and commit only the approved contents with the approved message. Preserve unrelated staged work. Reconfirm material changes before proceeding.
4. If pushing was approved, verify the current branch and destination still match the plan. Use an explicit single-branch refspec, such as `git push --no-follow-tags <remote> HEAD:refs/heads/<destination>`, adding `--set-upstream` when the approved plan establishes tracking. Publish only the approved branch, without extra tags or branches. Stop after local commits when the user chose commit only.
5. If a hook changes files or validation fails, inspect the outcome before continuing. Do not bypass hooks or silently include new changes. If any step fails, report completed actions and what remains; inspect local and remote state before retrying to avoid duplicate commits or PRs. A rejected push does not authorize a pull, rebase, or force-push.

If there are no uncommitted changes, do not create an empty commit. For a push request with existing unpublished commits, show those commits and adapt the labels to `🚀 Push (Recommended)` and the applicable PR actions. Otherwise report that there is nothing to commit or push.

## Pull request workflow

1. Before offering PR choices on GitHub, check for an open PR with `gh pr view --json number,title,body,baseRefName,headRefName,state,isDraft,url` or an explicit repository/head lookup. Distinguish no open PR from authentication, tooling, or network errors. Propose a new PR only when the planned head differs from the base and has changes to propose. Do not offer a PR from `main` into itself.
2. For an existing PR, propose metadata changes only when useful or requested. Preserve its template and relevant context, and edit only approved fields.
3. For a new PR, honor the requested base, repository instructions, and PR template; otherwise determine the default branch with `gh repo view --json defaultBranchRef -q .defaultBranchRef.name`. Prepare the title and body from the complete branch diff against the base, including a concise behavior summary and actual validation. Show the head repository/branch, base repository/branch, title, body, and available ready/draft states before approval.
4. After the approved push succeeds, create or update only the selected PR action. Pass explicit repository, head, and base arguments when creating a PR so the CLI cannot choose an unapproved push destination or fork. Use `--draft` only for the approved draft option. Use a structured tool argument for titles and bodies when available; with `gh`, write the exact multiline body to a temporary file and use `--body-file`, passing the title with safe argument handling. Do not use `gh pr create --dry-run` as a read-only preview because it may push changes. If draft creation is rejected, report the completed commits/push and ask before choosing another PR state.
5. Verify and report the created commit hashes, push destination, upstream changes, PR URL and state when applicable, and any remaining local changes or incomplete actions.
