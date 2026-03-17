# npm-gui-next Roadmap

This file tracks the requested next implementation steps for this fork.

## In Progress

- [x] Branding refresh to `npm-gui-next` across UI and project documentation
- [x] Header settings surface for user preferences
- [x] Delete confirmation dialog fix
- [x] Development run on port `3002`
- [x] Sequential bulk install/update modal with inline failure details
- [x] URL-safe active project state without encoded path routing

## Planned Features

### 1. Light/Dark Mode

Status:

- [x] started

Implementation plan:

- [x] Add persistent settings storage in localStorage.
- [x] Add a header settings menu for theme selection.
- [x] Apply theme through root-level CSS variables and a `data-theme` attribute.
- [x] Migrate major chrome components to theme variables first.
- [ ] Extend remaining hard-coded colors over follow-up passes.

Acceptance target:

- [x] Theme persists between reloads.
- [x] Main app chrome, tables, explorer, modal, and footer are readable in both themes.

### 2. Delete Dialog Fix

Status:

- [x] started

Implementation plan:

- [x] Replace direct delete toggle with an explicit confirmation modal.
- [x] Fix modal positioning, width, and click propagation.
- [x] Show package name and action buttons inside the dialog.

Acceptance target:

- [x] Delete confirmation is visible, readable, and interactive.

### 3. Bulk Install And Update Flow

Status:

- [x] started

Implementation plan:

- [x] Replace the old bulk update action with `All`, covering displayed packages with available updates.
- [x] Add `Install Selected` to the install column header for staged row selections.
- [x] Install selected versions sequentially, one dependency at a time.
- [x] Show a modal progress dialog with per-package status and inline failures.
- [x] Refresh dependency queries when the batch finishes or the modal closes.

Acceptance target:

- [x] Bulk install/update actions run in order and show visible modal progress.

### 4. Startup Setting For Invalid Current Directory

Status:

- [x] started

Implementation plan:

- [x] Add a persistent setting: `Open global packages when startup directory is not a Node project`
- [x] Use it during explorer startup auto-navigation.
- [x] Keep the explorer usable without forcing the invalid project route.

Acceptance target:

- [x] When enabled, `/` stays on the global screen if the startup directory has no Node project markers.

## Follow-Up Work

- [x] Expand theme coverage to all remaining hard-coded component colors
- [x] Add tests for settings persistence and invalid-start routing
- [x] Add broader client-side tests around `All`, `Install Selected`, modal close refresh behavior, and inline failure rendering
- [x] Add richer delete dialog copy and keyboard handling
- [x] Add a proactive environment warning for WSL `/mnt/...` installs that will fail with npm `EPERM` bin-link/chmod errors
- [x] Add a dedicated troubleshooting view or banner for backend command failures surfaced through normalized error payloads
