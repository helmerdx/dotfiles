---
name: brew-upgrade-review
description: Review outdated Homebrew packages on this Mac and recommend upgrades from release notes, skipping underscore revisions unless a documented bug or security fix justifies them.
---

# Homebrew upgrade review

Run a current Homebrew inventory and produce evidence-backed upgrade recommendations. This is a recommendation workflow; installing or upgrading packages requires a user request to do so.

## Inventory

1. Run `brew update` to refresh package metadata, then `HOMEBREW_NO_AUTO_UPDATE=1 brew outdated --json=v2`. If refresh fails, disclose that the inventory may be stale. If Homebrew is unavailable or inventory fails, report the blocker instead of inventing a package list.
2. Include both formulae and casks returned by the default outdated check. Add `--greedy` only when the user requests self-updating or `latest` casks. Respect pinned packages and retain fully qualified tap names and versioned formula names such as `python@3.14`.
3. Use `brew info --json=v2` for the relevant packages to identify upstream projects, stable versions, Homebrew revisions, installed metadata, caveats, and whether formulae were installed on request or as dependencies. Multiple installed kegs are historical installations, not separate upgrade candidates. Resolve the active version when needed rather than assuming array order means newest. Investigate apparent downgrades or version-scheme changes before recommending them.

## Review

Browse primary sources for the actual installed-to-target version range: upstream release notes, changelogs, security advisories, and Homebrew formula/cask commit or PR history. Open the source behind a search result before relying on it. Distinguish documented facts from inference, and cite the page or commit supporting each recommendation.

Apply the user's underscore rule literally:

- A target formula version ending in `_<digits>`, such as `1.2.3_1` or `1.2.3_2`, is skipped by default, including when the upstream version also increased.
- Recommend such a target only when a primary source explicitly documents a bug or security fix newly delivered relative to the installed version. State the concrete fix and link to it. A relevant upstream fix in the crossed version range qualifies when the upstream version changed. For a revision-only change, inspect Homebrew's intervening changes; old upstream release notes do not justify a new rebuild.
- A dependency rebuild, bottle refresh, compiler change, or generic revision bump alone is insufficient. A documented fix for broken linkage, crashes, installation failure, or a vulnerable bundled dependency can qualify when applicable to this Mac. If evidence is missing or unclear, keep the package skipped and say the fix was not verified.
- Treat only a trailing numeric formula revision as this suffix. Preserve `@` versioned formula names and cask version strings intact.

For other targets, prioritize verified security fixes and bug fixes, then useful stable improvements. Flag breaking changes, migrations, service restarts, and relevant caveats. Hold major runtime, database, or service upgrades for explicit review when compatibility is unresolved. A newer version alone does not establish safety or a security benefit. When release notes cannot be verified, mark the candidate as needing review and exclude it from the recommended command.

Account for every outdated package with a recommendation, review-needed status, or skip reason. Keep dependencies concise and identify them as dependencies instead of presenting all of them as independently used tools.

## Report

Show a compact table with package, installed version, target version, recommendation, and a short reason with a source link. Group repeated skip reasons when the inventory is large, retaining package names and versions. Highlight documented fixes that justify underscore exceptions.

Provide copyable `brew upgrade --formula <approved-names...>` and `brew upgrade --cask <approved-names...>` commands containing only recommended packages, separately from packages that need review. Shell-quote names as needed; omit empty commands. Use explicit package lists rather than bare `brew upgrade`.

Preview each proposed command with `HOMEBREW_NO_AUTO_UPDATE=1 brew upgrade --dry-run --formula <approved-names...>` or its `--cask` equivalent. Check for additional dependency or dependent upgrades and surface any skipped underscore targets pulled into the plan. Exclude affected roots from the final command until those additions are reviewed, or explain that no clean selective command is available. Do not use dependency-suppression flags or pin/unpin packages to force the filter. Report preview failures as unverified plans.

## Select upgrades

After the summary and command previews, open an actual selection modal with `functions.request_user_input_async` when available. Put the question in `questions[].title` and the actions in `questions[].options`. Identify the package names in each proposed group and refer to the versions already summarized. Offer these actions when applicable:

- `🛡️ Upgrade priorities only (Recommended)`
- `📦 Upgrade all recommended packages`
- `🎯 Choose specific packages`
- `⏸️ Skip upgrades`

The first two actions authorize executing their concrete package lists. Keep skipped and review-needed packages out of both lists. When the groups are identical, offer only one upgrade action. For a custom selection, use a follow-up modal with a numbered candidate list and ask for names, numbers, or exclusions such as `all except bottom`. This is a single-choice dialog with free-text input, not a multi-select checklist. Summarize the resulting exact list and obtain approval in a modal before upgrading it.

Re-run the dry run for the selected subset: removing optional packages can reveal dependent upgrades previously included in the larger plan. If targets or additional dependency upgrades differ from the approved selection, summarize the changes and use a modal to approve the additions or leave the affected packages unchanged. Proceed with unaffected approved packages while a separate dependency choice is pending.

Always present the package-by-package summary before any upgrade. A general request to upgrade or invoke this skill does not approve an unseen package list. Existing approval of a concrete selection persists; ask again only for a changed selection. Silence, a preselected option, and the tool's `accepted: true` response are not approval. Keep the turn open while an asynchronous modal is pending; wait interruptibly in intervals of at most 30 seconds and provide a brief update at least every 60 seconds. Honor cancellation without upgrading unapproved packages.

If this tool is unavailable, use another interactive tool only when its instructions permit approval requests in the active mode. Otherwise ask for the same choice in the final response and explain that a supported modal is unavailable. State whether any packages were upgraded.

Homebrew references: [revision semantics](https://docs.brew.sh/Formula-Cookbook#formulae-revisions), [command reference](https://docs.brew.sh/Manpage).
