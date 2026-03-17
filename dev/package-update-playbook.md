# Full Package Update Playbook

This document describes the current process for future dependency upgrades in `npm-gui-next`.

## Current Baseline

As of `2026-03-14`, the repository has already completed the large modernization pass that brought the project onto a current stack:

- React 19
- React Router 7
- Styled Components 6
- TanStack Query 5
- TypeScript 5.9
- Parcel 2.16
- Jest 30

This means the old historical plan for upgrading from the three-year-old dependency set is no longer the active development plan.

## What Changed Since The Original Upgrade Plan

The old plan included migration phases for packages and deprecations that are already resolved in this fork:

- `stable@0.1.8`
  removed by upgrading Parcel and its HTML optimization chain
- `w3c-hr-time@1.0.2`
  removed by upgrading the Jest/jsdom stack

Those items should now be treated as historical context, not pending work.

## Goal For Future Upgrade Cycles

For the next dependency maintenance pass, the goal is:

- keep every direct dependency on the latest validated version
- preserve a working dev run
- keep tests green after each step
- avoid environment-related false negatives during install and test execution

## Environment Rules

Use one of these environments when performing real upgrade work:

- native Windows from a Windows path
- WSL from the Linux filesystem, for example `~/src/npm-gui-next`

Do not perform upgrade work from `/mnt/c/...` inside WSL. npm installs and package mutation tests can fail there with `EPERM` during bin-link or `chmod`, which creates misleading upgrade failures.

## Upgrade Workflow

### 1. Capture The Real Starting Point

Before changing versions, regenerate the actual matrix instead of relying on stale documentation:

```bash
npm outdated --long
npm ls --depth=0
node -v
npm -v
```

Record:

- current Node version
- current npm version
- current outdated dependency list
- any transitive deprecation warnings still present

### 2. Update In Small Batches

Use small, reviewable batches rather than a single sweep. Prefer this order:

1. patch/minor updates with no expected API changes
2. build and test tooling
3. framework/runtime packages
4. packages with known code migrations

For every batch:

```bash
npm install
npm run lint:ts
npm run ci:test
npm run build
```

Then do a manual UI smoke test.

### 3. Run The UI Smoke Test

After each batch:

1. Start the API server:
   `npm run dev:server`
2. Start the client:
   `npm run dev:client`
3. Verify:
   local project load
   global view
   dependency table rendering
   search install flow
   delete confirmation modal
   settings and theme switching
   `All` bulk update flow
   `Install Selected` flow
   modal progress and inline failure rendering

### 4. Watch For Environment False Failures

If package installs fail with output like:

- `EPERM`
- `operation not permitted`
- `chmod .../node_modules/.../bin/...`

then the failure is most likely environmental, not a true package regression. Move the repo off `/mnt/c/...` or switch to native Windows before continuing.

### 5. Close The Cycle

At the end of the update cycle:

- ensure `npm outdated --long` is clean or intentionally documented
- update this file if the baseline stack changes again
- update `/dev` docs if package upgrades changed runtime behavior, tooling, or test commands

## Current Open Maintenance Topics

These are better next targets than repeating the already-finished historical migration:

- keep the Jest/browser test coverage aligned with the newer bulk install modal flows
- add explicit environment preflight warnings for WSL `/mnt/...` package mutations
- keep the docs in `dev/` aligned with the latest UI and architecture changes
