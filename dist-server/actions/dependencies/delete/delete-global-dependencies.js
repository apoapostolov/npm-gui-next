"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGlobalDependency = void 0;
const cache_1 = require("../../../utils/cache");
const execute_command_1 = require("../../execute-command");
const deleteGlobalNpmDependency = async (dependencyName) => {
    await (0, execute_command_1.executeCommand)(undefined, `npm uninstall ${dependencyName} -g`);
};
const deleteGlobalDependency = async ({ params: { dependencyName }, extraParams: { xCacheId } }) => {
    await deleteGlobalNpmDependency(dependencyName);
    (0, cache_1.spliceFromCache)(`${xCacheId}global`, dependencyName);
    return {};
};
exports.deleteGlobalDependency = deleteGlobalDependency;
