"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDependencies = void 0;
const cache_1 = require("../../../utils/cache");
const execute_command_1 = require("../../execute-command");
const commandTypeFlag = {
    prod: '-S',
    dev: '-D',
    global: '-g',
    extraneous: '',
};
const deleteNpmDependencies = async (projectPath, dependencies, type) => {
    // delete
    await (0, execute_command_1.executeCommandSimple)(projectPath, `npm uninstall ${dependencies.map((d) => d.name).join(' ')} ${commandTypeFlag[type]}`);
};
const deletePnpmDependencies = async (projectPath, dependencies) => {
    // delete
    try {
        await (0, execute_command_1.executeCommandSimple)(projectPath, `pnpm uninstall ${dependencies.map((d) => d.name).join(' ')}`);
    }
    catch (error) {
        // we are caching error it's unimportant in yarn
        if (!process.env['NODE_TEST']) {
            // eslint-disable-next-line no-console
            console.log(error);
        }
    }
};
const deleteYarnDependencies = async (projectPath, dependencies) => {
    // delete
    try {
        await (0, execute_command_1.executeCommandSimple)(projectPath, `yarn remove ${dependencies.map((d) => d.name).join(' ')}`);
    }
    catch (error) {
        // we are caching error it's unimportant in yarn
        if (!process.env['NODE_TEST']) {
            // eslint-disable-next-line no-console
            console.log(error);
        }
    }
};
const deleteDependencies = async ({ params: { type }, extraParams: { projectPathDecoded, manager, xCacheId }, body, }) => {
    if (manager === 'yarn') {
        await deleteYarnDependencies(projectPathDecoded, body);
    }
    else if (manager === 'pnpm') {
        await deletePnpmDependencies(projectPathDecoded, body);
    }
    else {
        await deleteNpmDependencies(projectPathDecoded, body, type);
    }
    for (const dependency of body) {
        (0, cache_1.spliceFromCache)(xCacheId + manager + projectPathDecoded, dependency.name);
    }
    return {};
};
exports.deleteDependencies = deleteDependencies;
