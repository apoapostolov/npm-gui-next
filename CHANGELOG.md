# Changelog

All notable user-facing changes in `npm-gui-next` are documented here.

## 5.0.1

### New And Improved User Features

- Added a packaged `npm-gui-next` CLI command so the app can be installed and launched globally like the original `npm-gui`.
- Added `Install All Latest` in both Local and Global views for bulk-updating the currently displayed packages with available updates.
- Added a new settings option for Global mode package changes:
  - `Use current npm on PATH for global installs and deletes`
  - enabled by default to match old `npm-gui` behavior
  - can be turned off to target the npm installation that owns the selected package
- Improved the bulk install progress modal so successfully updated packages disappear from the `to install` column immediately instead of waiting for the modal to close.
- Improved the bulk progress modal copy and failure presentation so errors stay inside the modal without triggering the development crash overlay.

### Global Package Management Improvements

- Global package listing now scans all npm installations visible on `PATH` instead of relying on a single `npm ls -g` result.
- Global listing now merges filesystem-discovered packages with `npm ls -g` output, including scoped packages that can be missed by npm metadata.
- Fixed stale `latest` values in Global mode when the same package name existed under multiple npm installations.
- Added clearer handling for permission failures on root-owned global packages, with actionable messages instead of raw npm stack traces.

### Dependency Fetching And Mutation Fixes

- Fixed npm 11 JSON parsing regressions for dependency listing and outdated checks.
- Fixed pnpm and Yarn fetch/parsing issues caused by current CLI output formats and warning lines under newer Node/npm environments.
- Fixed Local and Global bulk install refresh behavior so the dependency refresh runs asynchronously after completion and closing the modal no longer triggers a second refresh.
- Fixed the Local mode bulk action button label from `All` to `Install All Latest`.
- Fixed the Settings dialog so it no longer shows a forced vertical scrollbar when the content fits.
- Fixed the React warning caused by leaking the `prod` styled-components prop into the DOM.
- Restored the Global-mode footer/in-progress job indicator when switching into the global package view.

### Maintenance

- Added a repo-specific `AGENTS.md` with local development, rebuild/restart, and workflow guidance for future changes.

## 5.0.0

This release marks the transition from the unmaintained original `npm-gui` into `npm-gui-next`, the actively maintained fork by Apostol Apostolov.

### Highlights

- Revived the project after roughly three years of inactivity and rebranded the app, documentation, and package naming as `npm-gui-next`.
- Modernized the application stack for current Node, React, routing, styling, build tooling, and test tooling.
- Improved the overall UI consistency, theming, and cross-platform development workflow.

### New And Improved User Features

- Added light mode, dark mode, and system theme support with persistent settings.
- Added a centered settings dialog and improved modal behavior across the app.
- Restored and improved the Global view flow, including better startup handling when the current directory is not a Node project.
- Reworked the header and project switching behavior for faster movement between local projects and the global package list.
- Improved the Open explorer flow so local projects are detected and opened more reliably.

### Dependency Management Improvements

- Added sequential bulk update support through the `All` action for currently displayed packages with updates.
- Added `Install Selected` for staged dependency changes selected directly from the table.
- Added modal-based progress tracking for bulk installs and updates.
- Bulk progress now shows:
  - per-package status
  - elapsed time
  - inline failure details
  - continued processing after a failed package instead of aborting the whole batch
- Refreshes the dependency table when bulk operations complete or the progress dialog is closed.
- Fixed the delete dependency flow with a proper confirmation dialog instead of the broken zero-width rendering.
- Improved reinstall behavior and the related manager-selection controls.

### Package And Metadata UX

- Restored dependency score loading using `npms.io`.
- Improved npm package search behavior and result rendering.
- Standardized table header filters, dropdown alignment, button sizing, icon alignment, and footer job chips.
- Added better progress/footer behavior so the jobs strip stays visually stable as checks complete.

### Error Handling And Diagnostics

- Improved client/server request error reporting so real backend command failures are surfaced instead of generic request errors.
- Added troubleshooting guidance for failed package operations directly in the bulk progress modal.
- Added proactive warnings for WSL `/mnt/...` environments where npm installs can fail with `EPERM` permission errors.

### Documentation

- Rewrote the README for the forked project.
- Added and refreshed the internal `/dev` documentation set for UI, architecture, source mapping, local development, and package maintenance.
