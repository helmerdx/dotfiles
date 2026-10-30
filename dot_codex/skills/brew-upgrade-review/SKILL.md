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

Always present the package-by-package summary and proposed commands before any upgrade, then wait for the user to choose or approve the packages. A general request to upgrade or invoke this skill does not approve an unseen package list. Execute only the selection approved from a concrete summary; approval of that selection persists. If targets or additional dependency upgrades change after approval, summarize those changes and obtain approval for the changed selection before execution. State whether any packages were upgraded.

Homebrew references: [revision semantics](https://docs.brew.sh/Formula-Cookbook#formulae-revisions), [command reference](https://docs.brew.sh/Manpage).
