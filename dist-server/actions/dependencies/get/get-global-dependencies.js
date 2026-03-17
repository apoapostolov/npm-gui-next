"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGlobalDependenciesSimple = exports.getGlobalDependencies = void 0;
const cache_1 = require("../../../utils/cache");
const map_dependencies_1 = require("../../../utils/map-dependencies");
const execute_command_1 = require("../../execute-command");
const getGlobalNpmDependencies = async () => {
    const { dependencies: installedInfo } = await (0, execute_command_1.executeCommandJSONWithFallback)(undefined, 'npm ls -g --depth=0 --json');
    if (!installedInfo) {
        return [];
    }
    const outdatedInfo = await (0, execute_command_1.executeCommandJSONWithFallback)(undefined, 'npm outdated -g --json');
    return Object.keys(installedInfo).map((name) => ({
        manager: 'npm',
        name,
        type: 'global',
        installed: (0, map_dependencies_1.getInstalledVersion)(installedInfo[name]),
        latest: (0, map_dependencies_1.getLatestVersion)((0, map_dependencies_1.getInstalledVersion)(installedInfo[name]), null, outdatedInfo[name]),
    }));
};
const getGlobalNpmDependenciesSimple = async () => {
    const { dependencies: installedInfo } = await (0, execute_command_1.executeCommandJSONWithFallback)(undefined, 'npm ls -g --depth=0 --json');
    if (!installedInfo) {
        return [];
    }
    return Object.keys(installedInfo).map((name) => ({
        manager: 'npm',
        name,
        type: 'global',
        installed: (0, map_dependencies_1.getInstalledVersion)(installedInfo[name]),
    }));
};
const getGlobalDependencies = async ({ extraParams: { xCacheId }, }) => {
    const cache = (0, cache_1.getFromCache)(`${xCacheId}global`);
    if (cache) {
        return cache;
    }
    const npmDependencies = await getGlobalNpmDependencies();
    (0, cache_1.putToCache)(`${xCacheId}global`, npmDependencies);
    // TODO cache-id
    return npmDependencies;
};
exports.getGlobalDependencies = getGlobalDependencies;
const getGlobalDependenciesSimple = async () => {
    const npmDependencies = await getGlobalNpmDependenciesSimple();
    return npmDependencies;
};
exports.getGlobalDependenciesSimple = getGlobalDependenciesSimple;
