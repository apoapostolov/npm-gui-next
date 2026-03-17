"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installDependencies = exports.installDependenciesForceManager = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const cache_1 = require("../../../utils/cache");
const delete_folder_resursive_1 = require("../../../utils/delete-folder-resursive");
const execute_command_1 = require("../../execute-command");
const clearManagerFiles = (projectPath) => {
    if ((0, fs_1.existsSync)(`${path_1.default.normalize(projectPath)}/node_modules`)) {
        (0, delete_folder_resursive_1.deleteFolderRecursive)(`${path_1.default.normalize(projectPath)}/node_modules`);
    }
    for (const fileName of ['yarn.lock', 'package-lock.json', 'pnpm-lock.yaml']) {
        if ((0, fs_1.existsSync)(`${path_1.default.normalize(projectPath)}/${fileName}`)) {
            (0, fs_1.unlinkSync)(`${path_1.default.normalize(projectPath)}/${fileName}`);
        }
    }
};
const installDependenciesForceManager = async ({ params: { forceManager }, extraParams: { projectPathDecoded, xCacheId }, }) => {
    clearManagerFiles(projectPathDecoded);
    await (0, execute_command_1.executeCommandSimple)(projectPathDecoded, `${forceManager} install`);
    (0, cache_1.clearCache)(xCacheId + forceManager + projectPathDecoded);
    return {};
};
exports.installDependenciesForceManager = installDependenciesForceManager;
const installDependencies = async ({ extraParams: { projectPathDecoded, manager = 'npm', xCacheId }, }) => {
    await (0, execute_command_1.executeCommandSimple)(projectPathDecoded, `${manager} install`);
    (0, cache_1.clearCache)(xCacheId + manager + projectPathDecoded);
    return {};
};
exports.installDependencies = installDependencies;
