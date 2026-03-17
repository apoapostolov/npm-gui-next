# Client Architecture

## Entry And Bootstrapping

Files:

- [client/index.tsx](/mnt/c/git-public/npm-gui-next/client/index.tsx)
- [client/components/App.tsx](/mnt/c/git-public/npm-gui-next/client/components/App.tsx)

Boot sequence:

1. Import global CSS.
2. Create a React Query `QueryClient`.
3. Configure localStorage persistence for selected query families.
4. Mount the React tree into `.npm-gui`.
5. Ensure a stable `npm-gui-id` exists in localStorage.

Persisted React Query data:

- `get-dependencies-score`
- `get-dependencies-details`

Persistence window:

- 60 minutes

## Routing

Files:

- [client/components/App.tsx](/mnt/c/git-public/npm-gui-next/client/components/App.tsx)
- [client/hooks/use-active-project.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-active-project.ts)
- [client/hooks/use-project-path.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-project-path.ts)

The app now uses a single shell route:

- `*`

Interpretation:

- the browser URL no longer carries the active project
- the active project is stored in shared client state and persisted in `localStorage`
- project paths are still base64-encoded internally when a concrete filesystem path is stored client-side

## Local State Model

Files:

- [client/app/ContextStore.tsx](/mnt/c/git-public/npm-gui-next/client/app/ContextStore.tsx)
- [client/app/store.reducer.ts](/mnt/c/git-public/npm-gui-next/client/app/store.reducer.ts)
- [client/app/projects.storage.ts](/mnt/c/git-public/npm-gui-next/client/app/projects.storage.ts)

Top-level state:

```ts
interface State {
  projects: Project[];
}
```

Per-project tracked state:

```ts
interface Project {
  path: string;
  dependenciesMutate: Record<string, DependencyMutation>;
  jobs: Job[];
  isBusy: boolean;
}
```

What is persisted:

- the list of tracked project paths
- the active project path

What is not persisted:

- staged dependency mutations
- job history
- busy flags

Reducer responsibilities:

- add/remove tracked projects
- mark project busy/idle
- stage dependency install/delete operations
- cancel/reset staged operations
- create/update/remove job records

Important detail:

- `failedJob` currently dispatches `jobSuccess`, so failure state is not actually represented.

## Data Fetching Model

### Dependency Fetching

Files:

- [client/hooks/use-fast-dependencies.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-fast-dependencies.ts)
- [client/hooks/use-full-dependencies.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-full-dependencies.ts)

The dependency screen uses two queries:

- fast query:
  `/simple`
  sourced from `package.json` and local project metadata
- full query:
  `/full`
  sourced from package-manager commands and includes installed/wanted/latest data

Both queries are disabled while mutations are in flight for the same project key.

### Metadata Enrichment

Files:

- [client/hooks/use-bundle-score.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-bundle-score.ts)
- [client/hooks/use-bundle-details.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-bundle-details.ts)

Enrichment pipeline:

1. load dependencies
2. fetch score data by dependency name
3. fetch package details by `name@installedVersion`
4. merge results into the table row objects

Score source:

- `/api/score/:dependenciesName`

Details source:

- `/api/details/:manager/:dependenciesNameVersion`

### Auxiliary Queries

Files:

- [client/hooks/use-available-managers.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-available-managers.ts)
- [client/components/Header/components/use-explorer.ts](/mnt/c/git-public/npm-gui-next/client/components/Header/components/use-explorer.ts)
- [client/components/Project/Dependencies/DependenciesHeader/Search/use-search.ts](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/DependenciesHeader/Search/use-search.ts)

These power:

- manager availability selector
- filesystem explorer listings
- package search results
- Bun-aware reinstall manager availability in project view

## Mutation Model

### Staged Dependency Mutations

Files:

- [client/components/Project/Dependencies/table-cells/VersionCells/TableVersion.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/VersionCells/TableVersion.tsx)
- [client/components/Project/Dependencies/table-cells/ActionsCell/TableActions.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/ActionsCell/TableActions.tsx)
- [client/hooks/use-mutate-dependencies.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-mutate-dependencies.ts)

When a user clicks a version button in the table:

- the reducer stores a staged `required` target version
- the `install` column shows the pending version
- the row remains unchanged on disk until synchronization runs

When a user clicks the trash action:

- the reducer stages deletion for that dependency

Synchronization behavior:

- global view:
  batches global deletes and installs
- project view:
  batches deletes by dependency type, then installs by dependency type
- after success:
  staged mutations are reset

### Immediate Install Mutations

File:

- [client/hooks/use-mutate-install-dependency.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-mutate-install-dependency.ts)

Used by:

- search result install actions

Behavior:

- installs a single dependency immediately
- does not go through the staged table mutation path

### Reinstall Mutations

File:

- [client/hooks/use-mutate-reinstall.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-mutate-reinstall.ts)

Used by:

- `All`
- `Reinstall` manager selector

Behavior:

- no manager passed:
  runs detected manager install
- manager passed:
  forces reinstall using the selected manager after deleting lockfiles and `node_modules`
- the selector currently exposes `npm`, `pnpm`, `yarn`, and `bun` when available on the host

### Sequential Bulk Install / Update Mutations

Files:

- [client/hooks/use-install-all-latest.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-install-all-latest.ts)
- [client/hooks/use-install-all-latest.types.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-install-all-latest.types.ts)
- [client/components/Project/Dependencies/InstallProgressModal.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/InstallProgressModal.tsx)
- [client/components/Project/Dependencies/DependenciesHeader/DependenciesHeader.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/DependenciesHeader/DependenciesHeader.tsx)
- [client/components/Project/Dependencies/InstallHeader.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/InstallHeader.tsx)

Used by:

- `All`
- `Install Selected`

Behavior:

- `All` uses only currently displayed filtered rows with available updates
- `Install Selected` uses displayed rows with any explicitly staged target version, including `installed`, `wanted`, `latest`, or a manually chosen version
- installs run sequentially
- the modal progress bar advances twice per package: once on start, once on finish
- failed packages keep an inline error row and the queue continues
- elapsed time is shown in the modal while the queue is active
- closing the modal invalidates dependency queries again to refresh the table

## Busy State And Jobs

Files:

- [client/components/Project/use-project.ts](/mnt/c/git-public/npm-gui-next/client/components/Project/use-project.ts)
- [client/app/ContextStore.tsx](/mnt/c/git-public/npm-gui-next/client/app/ContextStore.tsx)

Busy state:

- derived from React Query `useIsFetching` and `useIsMutating`
- written into reducer state per project
- used to disable destructive or conflicting UI actions

Jobs:

- started by selected query/mutation hooks
- displayed in the bottom jobs strip
- marked `SUCCESS` with an appended execution time on completion
- only the latest five footer jobs are rendered at once

## Table Filtering And Sorting

Files:

- [client/ui/Table/use-table-filter.ts](/mnt/c/git-public/npm-gui-next/client/ui/Table/use-table-filter.ts)
- [client/ui/Table/use-table-sort.ts](/mnt/c/git-public/npm-gui-next/client/ui/Table/use-table-sort.ts)

Filtering:

- filters are shared through `use-between`
- filter state is not scoped by route or table instance
- string filters use `includes`

Sorting:

- click cycle is:
  ascending -> descending -> unsorted
- undefined values sort after defined values in normal order
- unsorted mode applies the special `@types` grouping behavior

## Service Layer

Files:

- [client/service/dependencies.service.ts](/mnt/c/git-public/npm-gui-next/client/service/dependencies.service.ts)
- [client/service/utils.ts](/mnt/c/git-public/npm-gui-next/client/service/utils.ts)

Responsibilities:

- build API URLs
- send fetch requests
- attach `x-cache-id` where needed
- normalize project/global route prefixes

Error model:

- any non-OK response throws a normalized error object with status, URL, parsed body, and optional backend `details`

## Client Types Shared With Server

The client imports many data types directly from `server/types`.
This keeps request/response contracts co-located but also couples the browser code to server internals at compile time.
