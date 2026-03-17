# AGENTS.md

Guidelines for automated agents working on `npm-gui-next`.

## Runtime Baseline

- Use `node -v` and `npm -v` before build, test, or run commands.
- This repo targets Node.js `>= 20`.
- In this workspace, the default shell currently uses Node `v25.x`.
- `ts-node-dev` is not reliable here under Node 25, so do not rely on `npm run dev:server` for local restart/verification.

## Repository Shape

- `client/`: Parcel + React frontend.
- `server/`: TypeScript API server.
- `dist/`: current built output used for local runnable server artifacts.
- `tests/`: Jest coverage for server and UI behavior.

## Dev Ports

- API server: `http://localhost:3002`
- Client UI: `http://localhost:1234`

## Build And Restart Protocol (Mandatory)

After any code change, always rebuild as needed and restart both server and client before handing work back. No exceptions.

Use this exact flow:

1. Verify runtime:
   ```bash
   node -v
   npm -v
   ```
2. Rebuild the server runtime:
   ```bash
   npx tsc -p server/tsconfig.json --noEmitOnError false
   ```
3. Restart the API server on `3002` from the built output:
   ```bash
   pkill -f "node dist/development.js localhost:3002" || true
   node dist/development.js localhost:3002
   ```
4. Restart the Parcel client on `1234`:
   ```bash
   pkill -f "parcel serve --target=client --port 1234" || true
   npm run dev:client -- --port 1234
   ```
5. Verify both are up:
   ```bash
   curl -I http://localhost:1234/
   curl -I http://localhost:3002/api/explorer/
   ss -ltnp | grep -E "3002|1234"
   ```

### Notes

- Do not leave stale server processes running from `dist-server/`; use `dist/development.js`.
- If a change is frontend-only, still restart both client and server before closing the task.
- If the server build introduces TypeScript errors, fix them before declaring the task done.

## Global Mode Rule

- Global package discovery must account for multiple npm installations on `PATH`.
- Do not assume a single global root.
- When changing Global mode logic, verify against all visible npm installations, not only the first `npm` on `PATH`.

## Testing Rule

- Run the narrowest relevant Jest scope for the change first.
- When changing dependency fetch, cache, manager detection, or Global mode logic, prefer targeted suites in `tests/` before broader runs.
- If tests fail due to environment-specific package manager behavior, document the exact command/output difference before changing expectations.

## Code Comment Standards

- Never reference planning labels like `P0`, `P1`, `P2`, `P3`, or any `PX` variant in source comments, CSS comments, or compiled/served files.
- Comments must explain technical intent, not project-management state.

## Documentation Sync

When behavior, runtime expectations, or dependencies change, update relevant docs in the same response:

1. `README.md`
2. `CHANGELOG.md` for user-visible behavior
3. `AGENTS.md` if the agent workflow or operational rules changed

## Changelog Rules

- Keep `CHANGELOG.md` user-facing.
- Record only user-visible behavior changes.
- Use Keep a Changelog style sections when adding entries:
  - `Added`
  - `Changed`
  - `Fixed`
  - `Removed`
- Do not add changelog entries for internal-only refactors, test-only changes, or agent-instructions-only updates unless the user explicitly asks.

## Dependency Hygiene

Whenever npm dependencies are added, removed, or replaced:

1. Update `package.json`
2. Update `README.md` if dependency/runtime instructions changed
3. Update `CHANGELOG.md` if the user-visible behavior changed

## Git Hygiene

- Keep commits scoped and atomic.
- Use conventional commit prefixes when committing:
  - `feat:`
  - `fix:`
  - `docs:`
  - `chore:`
  - `refactor:`
- Never mix unrelated fixes in one commit.

## Definition Of Done

A code change is not complete until all are true:

1. Relevant code and tests are updated.
2. The server is rebuilt.
3. Both API server and client are restarted.
4. Live verification on `3002` and `1234` has been performed.
5. Relevant docs are updated.
