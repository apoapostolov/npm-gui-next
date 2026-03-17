# Server Architecture

## Runtime Shape

Files:

- [server/index.ts](/mnt/c/git-public/npm-gui-next/server/index.ts)
- [server/simple-express.ts](/mnt/c/git-public/npm-gui-next/server/simple-express.ts)
- [server/development.ts](/mnt/c/git-public/npm-gui-next/server/development.ts)

The server is a custom HTTP server that does all of the following:

- route matching
- middleware execution
- JSON body parsing
- API response serialization
- static file serving
- single-page-app fallback to `client/index.html`

It is not Express despite the internal naming.

## Startup

`start(host, port, openBrowser)`:

- listens on `localhost:3002` by default
- optionally opens a browser window

Development entry:

- `server/development.ts`

## Request Processing Pipeline

Implemented in [server/simple-express.ts](/mnt/c/git-public/npm-gui-next/server/simple-express.ts).

Processing order:

1. read and JSON-parse request body
2. seed `extraParameters` with `x-cache-id` from headers
3. run matching middlewares
4. run the first matching responder for method + path
5. serialize string responses as HTML, everything else as JSON
6. on failure, return `400`
7. if no API route handled the request, serve static asset or fall back to SPA HTML

Important caveats:

- Route matching is regex-like and simple.
- Parameter extraction is based on string replacement rather than a full router.
- Middleware/responder matching uses broad regex conversion of `:params`.
- Errors are normalized into JSON payloads so the client can surface real request and command failure details.

## Middleware

### Project Path And Manager Detection

File:

- [server/middlewares/project-path-and-manager.middleware.ts](/mnt/c/git-public/npm-gui-next/server/middlewares/project-path-and-manager.middleware.ts)

Applied to:

- `/api/project/:projectPath/`

Responsibilities:

- decode base64 project path
- validate project structure
- detect package manager by lockfile
- provide derived params to downstream handlers

Detection order:

1. `bun.lock` or `bun.lockb` -> `bun`
2. `pnpm-lock.yaml` -> `pnpm`
3. `yarn.lock` -> `yarn`
4. `package.json` -> `npm`

Validation failure:

- throws `invalid project structure!`

## Error Handling And Debugging

Files:

- [server/simple-express.ts](/mnt/c/git-public/npm-gui-next/server/simple-express.ts)
- [server/actions/execute-command.ts](/mnt/c/git-public/npm-gui-next/server/actions/execute-command.ts)

Behavior:

- responder failures return HTTP `400`
- `Error` instances are serialized with `message`, `stack`, `method`, and `url`
- string command failures are wrapped into JSON with `message: "Command execution failed"` and `details` containing original command output
- this data is consumed by the client bulk-install modal for inline failure diagnostics

## API Surface

### Project Dependency APIs

- `GET /api/project/:projectPath/dependencies/simple`
  returns dependency names/types/required versions from `package.json`
- `GET /api/project/:projectPath/dependencies/full`
  returns installed/wanted/latest dependency data from package-manager commands
- `POST /api/project/:projectPath/dependencies/install`
  runs detected manager install
- `POST /api/project/:projectPath/dependencies/install/:forceManager`
  deletes lockfiles and `node_modules`, then runs forced manager install
- `POST /api/project/:projectPath/dependencies/:type`
  installs dependencies of type `prod` or `dev`
- `DELETE /api/project/:projectPath/dependencies/:type`
  removes dependencies of type `prod` or `dev`

### Global Dependency APIs

- `GET /api/global/dependencies/simple`
  returns globally installed npm packages with minimal data
- `GET /api/global/dependencies/full`
  returns globally installed npm packages with installed/latest versions
- `POST /api/global/dependencies`
  installs a global npm package
- `DELETE /api/global/dependencies/global/:dependencyName`
  removes a global npm package

Note:

- global operations are npm-only

### Metadata APIs

- `GET /api/score/:dependenciesName`
  fetches `npms.io` scores
- `GET /api/details/:manager/:dependenciesNameVersion`
  fetches package metadata using `bun info`, `npm info`, `pnpm info`, or `yarn info`

### Utility APIs

- `GET /api/explorer/:path`
- `GET /api/explorer/`
  filesystem listing for project discovery
- `GET /api/available-managers`
  probes whether `bun`, `npm`, `yarn`, and `pnpm` are available on the host
- `POST /api/search/:repoName`
  searches packages via `api.npms.io`
- `GET /api/info/:id`
  serves local project info content

## Dependency Reading

### Simple Reads

File:

- [server/actions/dependencies/get/get-project-dependencies.ts](/mnt/c/git-public/npm-gui-next/server/actions/dependencies/get/get-project-dependencies.ts)

Simple reads come from `package.json` helpers and are fast.
They provide the initial table shape before slower command-backed details arrive.

### Full Reads

Files:

- [server/actions/dependencies/get/get-project-dependencies.ts](/mnt/c/git-public/npm-gui-next/server/actions/dependencies/get/get-project-dependencies.ts)
- [server/actions/dependencies/get/get-global-dependencies.ts](/mnt/c/git-public/npm-gui-next/server/actions/dependencies/get/get-global-dependencies.ts)

Manager-specific command strategy:

- bun:
  `bun pm ls`, `bun outdated`
- npm:
  `npm ls`, `npm outdated`
- pnpm:
  `pnpm ls` plus custom outdated parsing
- yarn:
  `yarn list`, `yarn outdated`, and a fallback path if `yarn check` reports issues

Special cases:

- bun support is local-project only in the current fork; the global dependency view remains npm-only
- npm/pnpm can surface `extraneous` dependencies
- bun can also surface `extraneous` dependencies by comparing `bun pm ls` against `package.json`
- yarn fallback returns entries with `installed`, `wanted`, and `latest` all set to `null`

## Dependency Mutation Actions

### Project Adds

File:

- [server/actions/dependencies/add/add-project-dependencies.ts](/mnt/c/git-public/npm-gui-next/server/actions/dependencies/add/add-project-dependencies.ts)

Manager-specific commands:

- bun:
  `bun add ...` and `bun add ... -d` for dev dependencies
- npm:
  `npm install ... -P/-D --json`
- pnpm:
  `pnpm install ... -P/-D`
- yarn:
  `yarn add ...` and `-D` for dev dependencies

Cache behavior:

- single-package add updates cache in place
- multi-package add clears the cache for that project

### Project Deletes

File:

- [server/actions/dependencies/delete/delete-project-dependencies.ts](/mnt/c/git-public/npm-gui-next/server/actions/dependencies/delete/delete-project-dependencies.ts)

Manager-specific commands:

- bun:
  `bun remove`
- npm:
  `npm uninstall`
- pnpm:
  `pnpm uninstall`
- yarn:
  `yarn remove`

Cache behavior:

- removed packages are spliced from cache individually

### Global Adds/Deletes

Files:

- [server/actions/dependencies/add/add-global-dependencies.ts](/mnt/c/git-public/npm-gui-next/server/actions/dependencies/add/add-global-dependencies.ts)
- [server/actions/dependencies/delete/delete-global-dependencies.ts](/mnt/c/git-public/npm-gui-next/server/actions/dependencies/delete/delete-global-dependencies.ts)

Commands:

- add:
  `npm install <name>@<version> -g`
- delete:
  `npm uninstall <name> -g`

### Install/Reinstall

File:

- [server/actions/dependencies/install/install-project-dependencies.ts](/mnt/c/git-public/npm-gui-next/server/actions/dependencies/install/install-project-dependencies.ts)

Modes:

- plain install:
  runs `<manager> install`
- forced reinstall:
  deletes `node_modules`, `bun.lock`, `bun.lockb`, `yarn.lock`, `package-lock.json`, and `pnpm-lock.yaml`, then runs `<forceManager> install`

## Metadata Enrichment Actions

### Score Fetching

File:

- [server/actions/dependencies/extras/dependency-score.ts](/mnt/c/git-public/npm-gui-next/server/actions/dependencies/extras/dependency-score.ts)

Behavior:

- fetches package score data from `api.npms.io`
- maps returned score values into the dependency score payload used by the client
- processes dependencies in chunks of 5
- caches results in-memory by dependency name

### Package Details

File:

- [server/actions/dependencies/extras/dependency-details.ts](/mnt/c/git-public/npm-gui-next/server/actions/dependencies/extras/dependency-details.ts)

Behavior:

- runs package-manager `info` commands
- extracts homepage, repository, unpacked size, versions, and timestamps
- normalizes yarn’s different JSON shape and treats Bun like npm/pnpm for `--json` output
- caches results in-memory by `manager-name@version`

## Explorer And Search

### Explorer

File:

- [server/actions/explorer/explorer.ts](/mnt/c/git-public/npm-gui-next/server/actions/explorer/explorer.ts)

Behavior:

- lists filesystem entries for the requested path
- falls back to `process.cwd()` when path is missing or invalid
- marks entries as `isProject` when the entry name is a package or lock file, including Bun lockfiles

Important detail:

- project-ness is determined per entry name, not by testing whether a directory contains `package.json`

### Search

File:

- [server/actions/search/search.ts](/mnt/c/git-public/npm-gui-next/server/actions/search/search.ts)

Behavior:

- proxies search requests to `api.npms.io`
- returns trimmed result objects tailored for the search dropdown

## Caching

Files:

- [server/utils/cache.ts](/mnt/c/git-public/npm-gui-next/server/utils/cache.ts)
- [client/xcache.ts](/mnt/c/git-public/npm-gui-next/client/xcache.ts)

There are two distinct caching layers:

- server process memory:
  dependency lists keyed by `x-cache-id`, manager, and project
- client persisted query cache:
  score/details query results in localStorage

The `x-cache-id` header lets the client isolate dependency caches.

## Shared Types

Files:

- [server/types/dependency.types.ts](/mnt/c/git-public/npm-gui-next/server/types/dependency.types.ts)
- [server/types/new-server.types.ts](/mnt/c/git-public/npm-gui-next/server/types/new-server.types.ts)
- [server/types/global.types.ts](/mnt/c/git-public/npm-gui-next/server/types/global.types.ts)

Important domain types:

- `Type`:
  `dev | extraneous | global | prod`
- `Manager`:
  `npm | pnpm | yarn`
- `DependencyInstalled`
- `DependencyInstalledExtras`
- `SearchResponse`
- `ExplorerResponse`

## Operational Risks And Current Constraints

- The custom router has fewer safety guarantees than established frameworks.
- Several actions execute shell commands directly using dependency/package names.
- The info footer proxies third-party HTML into the client.
- Global dependency management is not abstracted across package managers.
- In-memory caches are process-local and are lost on restart.
