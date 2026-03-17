"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDependencies = exports.getAllDependenciesSimple = void 0;
const cache_1 = require("../../../utils/cache");
const get_project_package_json_1 = require("../../../utils/get-project-package-json");
const map_dependencies_1 = require("../../../utils/map-dependencies");
const execute_command_1 = require("../../execute-command");
const pnpm_utils_1 = require("../../pnpm-utils");
const yarn_utils_1 = require("../../yarn-utils");
const getAllDependenciesSimpleJSON = (projectPath, manager) => {
    return (0, get_project_package_json_1.getAllDependenciesFromPackageJsonAsArray)(projectPath, manager);
};
const getAllNpmDependencies = async (projectPath) => {
    const { dependencies: installedInfo } = await (0, execute_command_1.executeCommandJSONWithFallback)(projectPath, 'npm ls --depth=0 --json');
    // latest, wanted
    const outdatedInfo = await (0, execute_command_1.executeCommandJSONWithFallback)(projectPath, 'npm outdated --json');
    // extraneous
    const extraneousInstalled = installedInfo
        ? Object.keys(installedInfo).filter((name) => {
            const depInfo = installedInfo[name];
            return depInfo && 'extraneous' in depInfo;
        })
        : [];
    const allDependencies = [
        ...(0, get_project_package_json_1.getAllDependenciesFromPackageJsonAsArray)(projectPath, 'npm'),
        ...extraneousInstalled.map((name) => ({
            name,
            type: 'extraneous',
            required: undefined,
            manager: 'npm',
        })),
    ];
    return allDependencies.map((dependency) => {
        const installed = (0, map_dependencies_1.getInstalledVersion)(installedInfo ? installedInfo[dependency.name] : undefined);
        const wanted = (0, map_dependencies_1.getWantedVersion)(installed, outdatedInfo[dependency.name]);
        const latest = (0, map_dependencies_1.getLatestVersion)(installed, wanted, outdatedInfo[dependency.name]);
        return {
            ...dependency,
            installed,
            wanted,
            latest,
        };
    });
};
const getAllPnpmDependencies = async (projectPath) => {
    // type
    const dependencies = (0, get_project_package_json_1.getDependenciesFromPackageJson)(projectPath);
    const [{ devDependencies: installedInfoDevelopment, dependencies: installedInfoRegular, },] = await (0, execute_command_1.executeCommandJSONWithFallback)(projectPath, 'pnpm ls --depth=0 --json');
    const installedInfo = {
        ...installedInfoDevelopment,
        ...installedInfoRegular,
    };
    // latest, wanted
    const outdatedInfo = {};
    await (0, pnpm_utils_1.executePnpmOutdated)(outdatedInfo, projectPath);
    await (0, pnpm_utils_1.executePnpmOutdated)(outdatedInfo, projectPath, true);
    // extraneous
    const extraneousInstalled = Object.keys(installedInfo).filter((name) => {
        const depInfo = dependencies[name];
        return !depInfo;
    });
    const allDependencies = [
        ...(0, get_project_package_json_1.getAllDependenciesFromPackageJsonAsArray)(projectPath, 'pnpm'),
        ...extraneousInstalled.map((name) => ({
            name,
            type: 'extraneous',
            manager: 'pnpm',
            required: undefined,
        })),
    ];
    return allDependencies.map((dependency) => {
        const installed = (0, map_dependencies_1.getInstalledVersion)(installedInfo[dependency.name]);
        const wanted = (0, map_dependencies_1.getWantedVersion)(installed, outdatedInfo[dependency.name]);
        const latest = (0, map_dependencies_1.getLatestVersion)(installed, wanted, outdatedInfo[dependency.name]);
        return {
            ...dependency,
            installed,
            wanted,
            latest,
        };
    });
};
const getAllYarnDependencies = async (projectPath) => {
    // type
    const anyError = await (0, execute_command_1.executeCommandJSONWithFallbackYarn)(projectPath, 'yarn check --json');
    if (anyError !== undefined) {
        // there is some error in repo, we cant extract correct information
        return getAllDependenciesSimpleJSON(projectPath, 'yarn').map((dep) => ({
            ...dep,
            installed: null,
            wanted: null,
            latest: null,
        }));
    }
    const { data: { trees: installedInfo }, } = await (0, execute_command_1.executeCommandJSONWithFallback)(projectPath, 'yarn list --depth=0 --json');
    const outdatedInfo = await (0, execute_command_1.executeCommandJSONWithFallbackYarn)(projectPath, 'yarn outdated --json');
    const outdatedInfoExtracted = (0, yarn_utils_1.extractVersionFromYarnOutdated)(outdatedInfo);
    const allDependencies = (0, get_project_package_json_1.getAllDependenciesFromPackageJsonAsArray)(projectPath, 'yarn');
    return allDependencies.map((dependency) => {
        const info = installedInfo.find((x) => x.name.split('@')[0] === dependency.name);
        const installed = info === null || info === void 0 ? void 0 : info.name.split('@')[1];
        const wanted = (0, map_dependencies_1.getWantedVersion)(installed, outdatedInfoExtracted[dependency.name]);
        const latest = (0, map_dependencies_1.getLatestVersion)(installed, wanted, outdatedInfoExtracted[dependency.name]);
        return {
            ...dependency,
            installed,
            wanted,
            latest,
        };
    });
};
const getAllDependenciesSimple = ({ extraParams: { projectPathDecoded, manager } }) => {
    const dependencies = getAllDependenciesSimpleJSON(projectPathDecoded, manager);
    return dependencies;
};
exports.getAllDependenciesSimple = getAllDependenciesSimple;
const getAllDependencies = async ({ extraParams: { projectPathDecoded, manager, xCacheId } }) => {
    const cache = (0, cache_1.getFromCache)(xCacheId + manager + projectPathDecoded);
    if (cache) {
        return cache;
    }
    let dependencies = [];
    try {
        if (manager === 'yarn') {
            dependencies = await getAllYarnDependencies(projectPathDecoded);
        }
        else if (manager === 'pnpm') {
            dependencies = await getAllPnpmDependencies(projectPathDecoded);
        }
        else {
            dependencies = await getAllNpmDependencies(projectPathDecoded);
        }
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return [];
    }
    (0, cache_1.putToCache)(xCacheId + manager + projectPathDecoded, dependencies);
    return dependencies;
};
exports.getAllDependencies = getAllDependencies;
