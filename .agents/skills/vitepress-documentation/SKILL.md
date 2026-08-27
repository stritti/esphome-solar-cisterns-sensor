---
name: vitepress-documentation
description: Build, localize, validate, or deploy this repository's bilingual VitePress documentation and GitHub Pages workflow.
---

# VitePress Documentation

Use this skill for changes to the documentation site, its navigation or localization, and the GitHub Pages deployment workflow.

## Preserve the site structure

- Treat `docs/.vitepress/config.mts` as the canonical VitePress configuration, `package.json` as the source of documentation commands and dependencies, and `package-lock.json` as the reproducible dependency graph.
- Keep the GitHub Pages base path `/esphome-solar-cisterns-sensor/` unless the repository or Pages URL changes.
- Keep English sources at the root of `docs/` and German sources under `docs/de/`.
- Give translated pages the same filename in both locales. VitePress uses matching routes for the language switcher; for example, use `docs/WIRING.md` and `docs/de/WIRING.md`.
- Put locale-specific navigation, sidebar, outline, and label settings under `locales.<locale>.themeConfig`. Do not move them to `themeConfig.locales`.
- Keep `docs/VERKABELUNG.md` only as the short GitHub-facing pointer to `docs/de/WIRING.md`, and keep it listed in `srcExclude`.
- Use site-root routes such as `/WIRING` and `/de/WIRING` for VitePress navigation. Resolve source assets relative to the Markdown file that embeds them.
- Do not edit generated content in `node_modules/`, `docs/.vitepress/cache/`, or `docs/.vitepress/dist/`.

## Validate changes

1. Install dependencies with `npm ci --prefer-offline --no-audit --no-fund` when `node_modules/` is absent or dependencies changed. Regenerate and commit `package-lock.json` whenever `package.json` changes.
2. Run `npm run docs:build` after changing documentation, navigation, configuration, dependencies, or the deployment workflow.
3. Treat build errors and dead links as blockers.
4. For locale-sensitive changes, inspect the generated English and German routes under `docs/.vitepress/dist/`. Confirm localized navigation and that the language switch points to the matching translated page.
5. Run `git diff --check` before committing.

## Maintain GitHub Pages deployment

- Build the site with the scripts in `package.json`.
- Use `actions/setup-node` with the npm cache keyed by `package-lock.json`, followed by `npm ci --prefer-offline --no-audit --no-fund`. Do not cache `node_modules/` directly.
- Upload `docs/.vitepress/dist` as the Pages artifact.
- Preserve the workflow's least-privilege permissions: `contents: read`, `pages: write`, and `id-token: write`.
- Keep deployment limited to documentation-related changes on `main`, plus manual `workflow_dispatch` runs.
