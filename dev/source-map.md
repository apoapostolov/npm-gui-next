# Source Map

This file is a maintainers' inventory of the codebase by responsibility.

## Root

- [package.json](/mnt/c/git-public/npm-gui-next/package.json)
  scripts, build targets, dependencies, package metadata
- [README.md](/mnt/c/git-public/npm-gui-next/README.md)
  user-facing upstream readme
- [tsconfig.json](/mnt/c/git-public/npm-gui-next/tsconfig.json)
  root TypeScript config

## Client App

### App Shell

- [client/index.tsx](/mnt/c/git-public/npm-gui-next/client/index.tsx)
- [client/index.html](/mnt/c/git-public/npm-gui-next/client/index.html)
- [client/base.css](/mnt/c/git-public/npm-gui-next/client/base.css)
- [client/components/App.tsx](/mnt/c/git-public/npm-gui-next/client/components/App.tsx)

### App State

- [client/app/ContextStore.tsx](/mnt/c/git-public/npm-gui-next/client/app/ContextStore.tsx)
- [client/app/store.reducer.ts](/mnt/c/git-public/npm-gui-next/client/app/store.reducer.ts)
- [client/app/projects.storage.ts](/mnt/c/git-public/npm-gui-next/client/app/projects.storage.ts)
- [client/hooks/use-active-project.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-active-project.ts)

### Header And Project Selection

- [client/components/Header/Header.tsx](/mnt/c/git-public/npm-gui-next/client/components/Header/Header.tsx)
- [client/components/Header/use-header.ts](/mnt/c/git-public/npm-gui-next/client/components/Header/use-header.ts)
- [client/components/Header/components/Explorer.tsx](/mnt/c/git-public/npm-gui-next/client/components/Header/components/Explorer.tsx)
- [client/components/Header/components/ExplorerUi.ts](/mnt/c/git-public/npm-gui-next/client/components/Header/components/ExplorerUi.ts)
- [client/components/Header/components/use-explorer.ts](/mnt/c/git-public/npm-gui-next/client/components/Header/components/use-explorer.ts)

### Project Screen

- [client/components/Project/Project.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Project.tsx)
- [client/components/Project/use-project.ts](/mnt/c/git-public/npm-gui-next/client/components/Project/use-project.ts)
- [client/components/Project/ProjectJobs/ProjectJobs.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/ProjectJobs/ProjectJobs.tsx)
- [client/components/Project/ProjectJobs/JobItem.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/ProjectJobs/JobItem.tsx)

### Dependency Feature

- [client/components/Project/Dependencies/Dependencies.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/Dependencies.tsx)
- [client/components/Project/Dependencies/DependenciesHeader/DependenciesHeader.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/DependenciesHeader/DependenciesHeader.tsx)
- [client/components/Project/Dependencies/DependenciesHeader/Search/Search.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/DependenciesHeader/Search/Search.tsx)
- [client/components/Project/Dependencies/DependenciesHeader/Search/SearchForm.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/DependenciesHeader/Search/SearchForm.tsx)
- [client/components/Project/Dependencies/DependenciesHeader/Search/SearchInstall.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/DependenciesHeader/Search/SearchInstall.tsx)
- [client/components/Project/Dependencies/DependenciesHeader/Search/use-search.ts](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/DependenciesHeader/Search/use-search.ts)
- [client/components/Project/Dependencies/InstallHeader.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/InstallHeader.tsx)
- [client/components/Project/Dependencies/InstallProgressModal.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/InstallProgressModal.tsx)
- [client/components/Project/Dependencies/ToInstallHeader.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/ToInstallHeader.tsx)

### Dependency Table Cells

- [client/components/Project/Dependencies/table-cells/ActionsCell/ActionsCell.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/ActionsCell/ActionsCell.tsx)
- [client/components/Project/Dependencies/table-cells/ActionsCell/TableActions.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/ActionsCell/TableActions.tsx)
- [client/components/Project/Dependencies/table-cells/CompatibleCell.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/CompatibleCell.tsx)
- [client/components/Project/Dependencies/table-cells/HomePageCell.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/HomePageCell.tsx)
- [client/components/Project/Dependencies/table-cells/InstallCell/Install.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/InstallCell/Install.tsx)
- [client/components/Project/Dependencies/table-cells/InstallCell/InstallCell.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/InstallCell/InstallCell.tsx)
- [client/components/Project/Dependencies/table-cells/InstalledCell.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/InstalledCell.tsx)
- [client/components/Project/Dependencies/table-cells/LatestCell.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/LatestCell.tsx)
- [client/components/Project/Dependencies/table-cells/NameCell.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/NameCell.tsx)
- [client/components/Project/Dependencies/table-cells/NpmCell.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/NpmCell.tsx)
- [client/components/Project/Dependencies/table-cells/OtherVersionCell/OtherVersionCell.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/OtherVersionCell/OtherVersionCell.tsx)
- [client/components/Project/Dependencies/table-cells/OtherVersionCell/FindOtherVersions/FindOtherVersion.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/OtherVersionCell/FindOtherVersions/FindOtherVersion.tsx)
- [client/components/Project/Dependencies/table-cells/OtherVersionCell/FindOtherVersions/VersionColumn.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/OtherVersionCell/FindOtherVersions/VersionColumn.tsx)
- [client/components/Project/Dependencies/table-cells/OtherVersionCell/FindOtherVersions/use-find-other-version.ts](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/OtherVersionCell/FindOtherVersions/use-find-other-version.ts)
- [client/components/Project/Dependencies/table-cells/RepoCell.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/RepoCell.tsx)
- [client/components/Project/Dependencies/table-cells/ScoreCell.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/ScoreCell.tsx)
- [client/components/Project/Dependencies/table-cells/SizeCell.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/SizeCell.tsx)
- [client/components/Project/Dependencies/table-cells/TimeCell.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/TimeCell.tsx)
- [client/components/Project/Dependencies/table-cells/TypeCell.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/TypeCell.tsx)
- [client/components/Project/Dependencies/table-cells/VersionCells/TableVersion.tsx](/mnt/c/git-public/npm-gui-next/client/components/Project/Dependencies/table-cells/VersionCells/TableVersion.tsx)

### Client Hooks

- [client/hooks/use-available-managers.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-available-managers.ts)
- [client/hooks/use-bundle-details.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-bundle-details.ts)
- [client/hooks/use-bundle-score.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-bundle-score.ts)
- [client/hooks/use-fast-dependencies.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-fast-dependencies.ts)
- [client/hooks/use-full-dependencies.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-full-dependencies.ts)
- [client/hooks/use-install-all-latest.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-install-all-latest.ts)
- [client/hooks/use-install-all-latest.types.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-install-all-latest.types.ts)
- [client/hooks/use-mutate-dependencies.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-mutate-dependencies.ts)
- [client/hooks/use-mutate-install-dependency.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-mutate-install-dependency.ts)
- [client/hooks/use-mutate-reinstall.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-mutate-reinstall.ts)
- [client/hooks/use-project-path.ts](/mnt/c/git-public/npm-gui-next/client/hooks/use-project-path.ts)

### Shared UI

- [client/ui/Button/Button.tsx](/mnt/c/git-public/npm-gui-next/client/ui/Button/Button.tsx)
- [client/ui/Button/Link.tsx](/mnt/c/git-public/npm-gui-next/client/ui/Button/Link.tsx)
- [client/ui/Dropdown/Drodpown.tsx](/mnt/c/git-public/npm-gui-next/client/ui/Dropdown/Drodpown.tsx)
- [client/ui/Icon/Icon.tsx](/mnt/c/git-public/npm-gui-next/client/ui/Icon/Icon.tsx)
- [client/ui/Loader.tsx](/mnt/c/git-public/npm-gui-next/client/ui/Loader.tsx)
- [client/ui/Modal/Modal.tsx](/mnt/c/git-public/npm-gui-next/client/ui/Modal/Modal.tsx)
- [client/ui/ScoreBadge/ScoreBadge.tsx](/mnt/c/git-public/npm-gui-next/client/ui/ScoreBadge/ScoreBadge.tsx)
- [client/ui/Table/Table.tsx](/mnt/c/git-public/npm-gui-next/client/ui/Table/Table.tsx)
- [client/ui/Table/components/SelectFilter.tsx](/mnt/c/git-public/npm-gui-next/client/ui/Table/components/SelectFilter.tsx)
- [client/ui/Table/components/TbodyRow.tsx](/mnt/c/git-public/npm-gui-next/client/ui/Table/components/TbodyRow.tsx)
- [client/ui/Table/components/TextFilter.tsx](/mnt/c/git-public/npm-gui-next/client/ui/Table/components/TextFilter.tsx)
- [client/ui/Table/components/Th.tsx](/mnt/c/git-public/npm-gui-next/client/ui/Table/components/Th.tsx)
- [client/ui/Table/components/shared.tsx](/mnt/c/git-public/npm-gui-next/client/ui/Table/components/shared.tsx)
- [client/ui/Table/use-table-filter.ts](/mnt/c/git-public/npm-gui-next/client/ui/Table/use-table-filter.ts)
- [client/ui/Table/use-table-sort.ts](/mnt/c/git-public/npm-gui-next/client/ui/Table/use-table-sort.ts)
- [client/ui/hooks/use-click-outside.ts](/mnt/c/git-public/npm-gui-next/client/ui/hooks/use-click-outside.ts)
- [client/ui/hooks/use-interval.ts](/mnt/c/git-public/npm-gui-next/client/ui/hooks/use-interval.ts)
- [client/ui/hooks/use-toggle.ts](/mnt/c/git-public/npm-gui-next/client/ui/hooks/use-toggle.ts)

### Client Services And Utilities

- [client/service/dependencies.service.ts](/mnt/c/git-public/npm-gui-next/client/service/dependencies.service.ts)
- [client/service/utils.ts](/mnt/c/git-public/npm-gui-next/client/service/utils.ts)
- [client/service/dependencies-cache.ts](/mnt/c/git-public/npm-gui-next/client/service/dependencies-cache.ts)
- [client/utils.ts](/mnt/c/git-public/npm-gui-next/client/utils.ts)
- [client/xcache.ts](/mnt/c/git-public/npm-gui-next/client/xcache.ts)
- [client/Styled.ts](/mnt/c/git-public/npm-gui-next/client/Styled.ts)

## Server

### Server Core

- [server/index.ts](/mnt/c/git-public/npm-gui-next/server/index.ts)
- [server/development.ts](/mnt/c/git-public/npm-gui-next/server/development.ts)
- [server/simple-express.ts](/mnt/c/git-public/npm-gui-next/server/simple-express.ts)
- [server/index.html](/mnt/c/git-public/npm-gui-next/server/index.html)

### Middleware

- [server/middlewares/project-path-and-manager.middleware.ts](/mnt/c/git-public/npm-gui-next/server/middlewares/project-path-and-manager.middleware.ts)

### Server Actions

- [server/actions/available-managers/available-managers.ts](/mnt/c/git-public/npm-gui-next/server/actions/available-managers/available-managers.ts)
- [server/actions/bun-utils.ts](/mnt/c/git-public/npm-gui-next/server/actions/bun-utils.ts)
- [server/actions/dependencies/add/add-global-dependencies.ts](/mnt/c/git-public/npm-gui-next/server/actions/dependencies/add/add-global-dependencies.ts)
- [server/actions/dependencies/add/add-project-dependencies.ts](/mnt/c/git-public/npm-gui-next/server/actions/dependencies/add/add-project-dependencies.ts)
- [server/actions/dependencies/delete/delete-global-dependencies.ts](/mnt/c/git-public/npm-gui-next/server/actions/dependencies/delete/delete-global-dependencies.ts)
- [server/actions/dependencies/delete/delete-project-dependencies.ts](/mnt/c/git-public/npm-gui-next/server/actions/dependencies/delete/delete-project-dependencies.ts)
- [server/actions/dependencies/extras/dependency-details.ts](/mnt/c/git-public/npm-gui-next/server/actions/dependencies/extras/dependency-details.ts)
- [server/actions/dependencies/extras/dependency-score.ts](/mnt/c/git-public/npm-gui-next/server/actions/dependencies/extras/dependency-score.ts)
- [server/actions/dependencies/extras/utils.ts](/mnt/c/git-public/npm-gui-next/server/actions/dependencies/extras/utils.ts)
- [server/actions/dependencies/get/get-global-dependencies.ts](/mnt/c/git-public/npm-gui-next/server/actions/dependencies/get/get-global-dependencies.ts)
- [server/actions/dependencies/get/get-project-dependencies.ts](/mnt/c/git-public/npm-gui-next/server/actions/dependencies/get/get-project-dependencies.ts)
- [server/actions/dependencies/install/install-project-dependencies.ts](/mnt/c/git-public/npm-gui-next/server/actions/dependencies/install/install-project-dependencies.ts)
- [server/actions/execute-command.ts](/mnt/c/git-public/npm-gui-next/server/actions/execute-command.ts)
- [server/actions/explorer/explorer.ts](/mnt/c/git-public/npm-gui-next/server/actions/explorer/explorer.ts)
- [server/actions/info/info.ts](/mnt/c/git-public/npm-gui-next/server/actions/info/info.ts)
- [server/actions/pnpm-utils.ts](/mnt/c/git-public/npm-gui-next/server/actions/pnpm-utils.ts)
- [server/actions/search/search.ts](/mnt/c/git-public/npm-gui-next/server/actions/search/search.ts)
- [server/actions/yarn-utils.ts](/mnt/c/git-public/npm-gui-next/server/actions/yarn-utils.ts)

### Server Types

- [server/types/commands.types.ts](/mnt/c/git-public/npm-gui-next/server/types/commands.types.ts)
- [server/types/dependency.types.ts](/mnt/c/git-public/npm-gui-next/server/types/dependency.types.ts)
- [server/types/global.types.ts](/mnt/c/git-public/npm-gui-next/server/types/global.types.ts)
- [server/types/new-server.types.ts](/mnt/c/git-public/npm-gui-next/server/types/new-server.types.ts)
- [server/types/pnpm.types.ts](/mnt/c/git-public/npm-gui-next/server/types/pnpm.types.ts)
- [server/types/yarn.types.ts](/mnt/c/git-public/npm-gui-next/server/types/yarn.types.ts)

### Server Utilities

- [server/utils/cache.ts](/mnt/c/git-public/npm-gui-next/server/utils/cache.ts)
- [server/utils/delete-folder-resursive.ts](/mnt/c/git-public/npm-gui-next/server/utils/delete-folder-resursive.ts)
- [server/utils/get-project-package-json.ts](/mnt/c/git-public/npm-gui-next/server/utils/get-project-package-json.ts)
- [server/utils/map-dependencies.ts](/mnt/c/git-public/npm-gui-next/server/utils/map-dependencies.ts)
- [server/utils/parse-json.ts](/mnt/c/git-public/npm-gui-next/server/utils/parse-json.ts)
- [server/utils/request-with-promise.ts](/mnt/c/git-public/npm-gui-next/server/utils/request-with-promise.ts)
- [server/utils/simple-cross-spawn.ts](/mnt/c/git-public/npm-gui-next/server/utils/simple-cross-spawn.ts)
- [server/utils/utils.ts](/mnt/c/git-public/npm-gui-next/server/utils/utils.ts)

## Tests

- [tests/add-multiple.test.ts](/mnt/c/git-public/npm-gui-next/tests/add-multiple.test.ts)
- [tests/add-single.test.ts](/mnt/c/git-public/npm-gui-next/tests/add-single.test.ts)
- [tests/cache.test.ts](/mnt/c/git-public/npm-gui-next/tests/cache.test.ts)
- [tests/comparators.test.ts](/mnt/c/git-public/npm-gui-next/tests/comparators.test.ts)
- [tests/delete.test.ts](/mnt/c/git-public/npm-gui-next/tests/delete.test.ts)
- [tests/explorer.test.ts](/mnt/c/git-public/npm-gui-next/tests/explorer.test.ts)
- [tests/extras.test.ts](/mnt/c/git-public/npm-gui-next/tests/extras.test.ts)
- [tests/fetching.test.ts](/mnt/c/git-public/npm-gui-next/tests/fetching.test.ts)
- [tests/global.test.ts](/mnt/c/git-public/npm-gui-next/tests/global.test.ts)
- [tests/info.test.ts](/mnt/c/git-public/npm-gui-next/tests/info.test.ts)
- [tests/install-force.test.ts](/mnt/c/git-public/npm-gui-next/tests/install-force.test.ts)
- [tests/install-modal.test.ts](/mnt/c/git-public/npm-gui-next/tests/install-modal.test.ts)
- [tests/install.test.ts](/mnt/c/git-public/npm-gui-next/tests/install.test.ts)
- [tests/invalid-project.test.ts](/mnt/c/git-public/npm-gui-next/tests/invalid-project.test.ts)
- [tests/managers.test.ts](/mnt/c/git-public/npm-gui-next/tests/managers.test.ts)
- [tests/search.test.ts](/mnt/c/git-public/npm-gui-next/tests/search.test.ts)
- [tests/setup-tests.js](/mnt/c/git-public/npm-gui-next/tests/setup-tests.js)
- [tests/tests-utils.ts](/mnt/c/git-public/npm-gui-next/tests/tests-utils.ts)
- [tests/units.test.ts](/mnt/c/git-public/npm-gui-next/tests/units.test.ts)
