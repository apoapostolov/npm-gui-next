"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGlobalDependencies = void 0;
const cache_1 = require("../../../utils/cache");
const map_dependencies_1 = require("../../../utils/map-dependencies");
const execute_command_1 = require("../../execute-command");
const addGlobalNpmDependency = async ({ name, version, }) => {
    // add
    await (0, execute_command_1.executeCommand)(undefined, `npm install ${name}@${version || ''} -g`);
    // get package info
    const { dependencies: installedInfo } = await (0, execute_command_1.executeCommandJSONWithFallback)(undefined, `npm ls ${name} --depth=0 -g --json`);
    const outdatedInfo = await (0, execute_command_1.executeCommandJSONWithFallback)(undefined, `npm outdated ${name} -g --json`);
    const installed = (0, map_dependencies_1.getInstalledVersion)(installedInfo ? installedInfo[name] : undefined);
    return {
        manager: 'npm',
        name,
        type: 'global',
        installed,
        latest: (0, map_dependencies_1.getLatestVersion)(installed, null, outdatedInfo[name]),
    };
};
const addGlobalDependencies = async ({ body, extraParams: { xCacheId }, }) => {
    const dependency = await addGlobalNpmDependency(body[0]);
    (0, cache_1.updateInCache)(`${xCacheId}global`, dependency);
    return {};
};
exports.addGlobalDependencies = addGlobalDependencies;
