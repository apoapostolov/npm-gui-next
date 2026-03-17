# npm-gui-next Internal Documentation

This folder documents the current application as implemented in this fork.
It is intended for maintainers working on `npm-gui-next`, not end users.

## Scope

This documentation covers:

- application purpose and runtime shape
- every visible UI area and reusable UI primitive
- client-side state, routing, data fetching, and mutation flows
- server architecture, middleware, endpoints, and command execution
- source map of the important files and directories

## At A Glance

`npm-gui-next` is a two-part application:

- `client/`: a React 19 + `react-router-dom` 7 + `styled-components` 6 UI rendered from a single-shell app
- `server/`: a custom Node HTTP server with its own routing and middleware layer that serves both the API and the built frontend

The main user workflow is:

1. Open the app.
2. Work in the implicit `global` view or choose a project from the file explorer.
3. Load dependency data in two stages:
   fast stage from `package.json`
   full stage from package-manager commands
4. Enrich rows with package score and package metadata.
5. Queue dependency changes in client state.
6. Apply changes through install/remove/reinstall operations backed by server commands.

## Document Index

- [UI Catalog](/mnt/c/git-public/npm-gui-next/dev/ui.md)
- [Client Architecture](/mnt/c/git-public/npm-gui-next/dev/client-architecture.md)
- [Server Architecture](/mnt/c/git-public/npm-gui-next/dev/server-architecture.md)
- [Source Map](/mnt/c/git-public/npm-gui-next/dev/source-map.md)
- [Running Locally](/mnt/c/git-public/npm-gui-next/dev/running-locally.md)
- [Full Package Update Playbook](/mnt/c/git-public/npm-gui-next/dev/package-update-playbook.md)

## Important Current Behaviors

- The browser URL stays at `/`; active project selection is stored in client state and `localStorage`.
- Project selection is persisted in `localStorage` under `projects`, and the active project is persisted separately.
- React Query persists only package score and package details caches to `localStorage`.
- The dependency table is the central screen and supports filtering, sorting, staged version changes, deletion staging, search-based installs, reinstall operations, and sequential modal-based bulk installs.
- Global dependencies use dedicated server endpoints and only support `npm`.
- The server auto-detects `bun`, `npm`, `yarn`, or `pnpm` for project operations from lockfiles.
- Failed API requests now return normalized JSON error payloads so the UI can surface real command output.

## Known Implementation Notes Worth Remembering

- The codebase still uses some legacy `npm-gui` naming in internal identifiers.
- `server/simple-express.ts` is not Express; it is a homegrown router/static server.
- `client/ui/Dropdown/Drodpown.tsx` contains a filename typo in `Drodpown`.
- Job tracking exists in UI state, but the footer chip modal still does not expose rich stdout/stderr history.
- npm update/install operations executed from WSL on `/mnt/...` can fail with `EPERM` during bin-link or `chmod`; prefer native Windows or the Linux filesystem for real install testing.
