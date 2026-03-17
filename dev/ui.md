# UI Catalog

This document catalogs the visible UI structure and the shared UI building blocks.

## Global Layout

The application shell is mounted into `.npm-gui` and is arranged as a vertical stack:

1. Header navigation bar
2. Main project content area
3. Jobs strip for the selected project

Primary shell files:

- [client/index.html](/mnt/c/git-public/npm-gui-next/client/index.html)
- [client/base.css](/mnt/c/git-public/npm-gui-next/client/base.css)
- [client/components/App.tsx](/mnt/c/git-public/npm-gui-next/client/components/App.tsx)

## Visual Language

- Base font: Roboto/Helvetica/Arial stack on `body`
- Table font: Menlo/Monaco/Consolas monospace
- Main dark chrome color: `#3e3f3a`
- Button colors:
  - primary `#325d88`
  - info `#1b8dbb`
  - success `#79a736`
  - warning `#ef5c0e`
  - danger `#d9534f`
  - dark `#3e3f3a`
- Table borders and neutrals use `#dfd7ca`
- Row hover background uses `#f8f5f0`

## Screen Areas

### Header Bar

Files:

- [client/components/Header/Header.tsx](/mnt/c/git-public/npm-gui-next/client/components/Header/Header.tsx)
- [client/components/Header/use-header.ts](/mnt/c/git-public/npm-gui-next/client/components/Header/use-header.ts)

Visible elements:

- Title: `npm-gui-next`
- `Global` button:
  switches between global view and the last local project
- One button per tracked project:
  label is the last segment of the decoded path
- Close button next to each tracked project:
  removes project from local state and storage
- `Open` button:
  opens the file explorer dropdown

State/behavior:

- Active project button uses the `info` button variant.
- Non-active buttons use the `dark` variant.
- Removing the currently selected project switches to another known project or `global`.

### Explorer Dropdown

Files:

- [client/components/Header/components/Explorer.tsx](/mnt/c/git-public/npm-gui-next/client/components/Header/components/Explorer.tsx)
- [client/components/Header/components/ExplorerUi.ts](/mnt/c/git-public/npm-gui-next/client/components/Header/components/ExplorerUi.ts)
- [client/components/Header/components/use-explorer.ts](/mnt/c/git-public/npm-gui-next/client/components/Header/components/use-explorer.ts)

Visible elements:

- Current filesystem path display
- Text filter input
- `../` button for navigating upward
- Directory rows with folder icon
- Project marker rows when a `package.json`, `package-lock.json`, `bun.lock`, `bun.lockb`, `yarn.lock`, or `pnpm-lock.yaml` entry is present
- Plain file rows

Behavior:

- First load requests `/api/explorer/`; server falls back to `process.cwd()`.
- Clicking a directory loads a new explorer listing.
- Clicking a project entry updates client-side active project state without changing the browser URL.
- `node_modules` directories are intentionally disabled in the UI.
- Clicking outside closes the dropdown.

### Main Project Area

File:

- [client/components/Project/Project.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Project.tsx)

States:

- Verifying state:
  centered loader with `Verifying`
- Invalid project state:
  explains that the selected path does not represent a valid project
- Loaded state:
  renders the dependency management screen

### Dependency Screen Header

File:

- [client/components/Project/Dependencies/DependenciesHeader/DependenciesHeader.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/DependenciesHeader/DependenciesHeader.tsx)

Visible elements:

- Search control on the left
- `All` button for project views only
- `Reinstall` manager selector for project views only

Behavior:

- Global view does not show reinstall controls.
- `All` runs sequential updates for displayed packages with available updates.
- `Reinstall` removes `node_modules` and known lockfiles, then runs the selected manager install.
- The reinstall selector can expose `npm`, `pnpm`, `yarn`, and `bun` when those managers are available on the host.
- Buttons are disabled while the project is busy.
- `Install Selected` lives in the install column header and runs a modal-backed sequential install for displayed staged rows.

### Search Control

Files:

- [client/components/Project/Dependencies/DependenciesHeader/Search/Search.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/DependenciesHeader/Search/Search.tsx)
- [client/components/Project/Dependencies/DependenciesHeader/Search/SearchForm.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/DependenciesHeader/Search/SearchForm.tsx)
- [client/components/Project/Dependencies/DependenciesHeader/Search/SearchInstall.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/DependenciesHeader/Search/SearchInstall.tsx)

Visible elements:

- Disabled package-manager selector fixed to `npm`
- Search text input
- Search button
- `source: npms.io` link
- Search results dropdown table

Search result columns:

- `name`
- `latest` version install button
- `score`
- `updated`
- homepage link icon
- repository link icon
- npm link icon

Install behavior:

- Clicking a version opens a small action menu.
- The menu offers `install as prod` and `install as dev`.
- This flow performs an immediate install mutation rather than a staged table change.

### Dependency Table

Files:

- [client/components/Project/Dependencies/Dependencies.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/Dependencies.tsx)
- [client/ui/Table/Table.tsx](/mnt/c/git-public/npm-gui-next/client/ui/Table/Table.tsx)

Project-view columns:

- `type`
- `name`
- homepage icon
- repository icon
- npm icon
- `score`
- `size`
- `updated`
- `required`
- `to`
- `install`
- `installed`
- `wanted`
- `latest`
- actions

Global-view columns:

- `name`
- homepage icon
- repository icon
- npm icon
- `score`
- `size`
- `updated`
- `to`
- `install`
- `installed`
- `latest`
- actions

Table states:

- loading overlay
- `empty...` overlay
- sticky header
- sortable columns
- per-column filters where enabled

Default unsorted behavior:

- `@types/*` packages are visually grouped under the corresponding package when possible.

### Dependency Table Cell Catalog

Key cell files:

- [client/components/Project/Dependencies/table-cells/TypeCell.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/TypeCell.tsx)
- [client/components/Project/Dependencies/table-cells/NameCell.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/NameCell.tsx)
- [client/components/Project/Dependencies/table-cells/ScoreCell.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/ScoreCell.tsx)
- [client/components/Project/Dependencies/table-cells/SizeCell.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/SizeCell.tsx)
- [client/components/Project/Dependencies/table-cells/TimeCell.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/TimeCell.tsx)
- [client/components/Project/Dependencies/table-cells/VersionCells/TableVersion.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/VersionCells/TableVersion.tsx)
- [client/components/Project/Dependencies/table-cells/OtherVersionCell/FindOtherVersions/FindOtherVersion.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/OtherVersionCell/FindOtherVersions/FindOtherVersion.tsx)
- [client/components/Project/Dependencies/table-cells/ActionsCell/TableActions.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/ActionsCell/TableActions.tsx)

Cell behaviors:

- `type`:
  shows `dev`, `extraneous`, or `global`; hides `prod`
- `name`:
  left-aligned; production packages are bold; synthetic `@types` children draw a tree marker
- homepage/repository/npm:
  icon links when source data exists
- `score`:
  badge linking to `npms.io`
- `size`:
  package size from manager metadata
- `updated`:
  relative time display
- `required`:
  raw semver expression from `package.json`
- `to`:
  opens a 3-column chooser of major/minor/patch versions
- `install`:
  shows the staged target version and a cancel button
- `installed`:
  shows installed version, `missing`, loader, or upgrade button depending on state
- `wanted`:
  install button for the semver-compatible version
- `latest`:
  install button for the newest known version
- actions:
  marks package for deletion or cancels that staged deletion

### Jobs Strip

Files:

- [client/components/Project/ProjectJobs/ProjectJobs.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/ProjectJobs/ProjectJobs.tsx)
- [client/components/Project/ProjectJobs/JobItem.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/ProjectJobs/JobItem.tsx)

Visible elements:

- one button-like chip per job
- close button next to each job
- placeholder modal when a job chip is opened
- maintainer/repository note aligned on the right

Status colors:

- `WORKING` -> `info`
- `SUCCESS` -> `success`
- fallback -> `primary`

Notes:

- Close is disabled while a job is `WORKING`.
- The details modal is structurally present but does not yet render logs/output.

### Footer Info Strip

File:

- [client/components/Info.tsx](/mnt/c/git-public/npm-gui-next/client/components/Info.tsx)

Behavior:

- Historical component kept in the source tree from older `npm-gui` behavior.
- The current user-facing footer instead centers on project job chips plus the maintainer/repository note rendered from the project screen.

## Shared UI Primitives

### Button

File:

- [client/ui/Button/Button.tsx](/mnt/c/git-public/npm-gui-next/client/ui/Button/Button.tsx)

Capabilities:

- color variants
- optional icon
- optional route navigation via `navigate`
- disabled state

Used for:

- navigation
- mutations
- version selection
- modal close controls
- explorer actions

### Link

File:

- [client/ui/Button/Link.tsx](/mnt/c/git-public/npm-gui-next/client/ui/Button/Link.tsx)

Used for:

- external metadata links
- source attribution

### Dropdown

File:

- [client/ui/Dropdown/Drodpown.tsx](/mnt/c/git-public/npm-gui-next/client/ui/Dropdown/Drodpown.tsx)

Pattern:

- child 0 renders the trigger
- child 1 renders the content
- internal outside-click handling closes the panel

Used by:

- explorer
- package search
- version chooser

### Modal

File:

- [client/ui/Modal/Modal.tsx](/mnt/c/git-public/npm-gui-next/client/ui/Modal/Modal.tsx)

Current use:

- job details overlay

### Loader

File:

- [client/ui/Loader.tsx](/mnt/c/git-public/npm-gui-next/client/ui/Loader.tsx)

Current use:

- project verification
- table loading
- search button loading state
- installed-version pending state

### ScoreBadge

File:

- [client/ui/ScoreBadge/ScoreBadge.tsx](/mnt/c/git-public/npm-gui-next/client/ui/ScoreBadge/ScoreBadge.tsx)

Purpose:

- visually encode package score in the table

## UI Gaps And Oddities

- Search form disables input/button only when `searchResults === undefined`, but the hook initializes with `[]`, so the loading path is effectively unused.
- Invalid-project fallback in the table component currently returns `błąd`, which is separate from the more complete invalid-project screen in `Project.tsx`.
- Footer HTML is rendered with `dangerouslySetInnerHTML`.
- The app label and browser title still use the original `npm-gui` naming.
