"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDependencies = void 0;
const cache_1 = require("../../../utils/cache");
const get_project_package_json_1 = require("../../../utils/get-project-package-json");
const map_dependencies_1 = require("../../../utils/map-dependencies");
const execute_command_1 = require("../../execute-command");
const pnpm_utils_1 = require("../../pnpm-utils");
const yarn_utils_1 = require("../../yarn-utils");
const getNpmPackageWithInfo = async (projectPath, dependencyName) => {
    // installed or not
    const { dependencies: installedInfo } = await (0, execute_command_1.executeCommandJSONWithFallback)(projectPath, `npm ls ${dependencyName} --depth=0 --json`);
    // latest, wanted
    const outdatedInfo = await (0, execute_command_1.executeCommandJSONWithFallback)(projectPath, `npm outdated ${dependencyName} --json`);
    // required & type
    const type = (0, get_project_package_json_1.getTypeFromPackageJson)(projectPath, dependencyName);
    const required = (0, get_project_package_json_1.getRequiredFromPackageJson)(projectPath, dependencyName);
    const installed = (0, map_dependencies_1.getInstalledVersion)(installedInfo ? installedInfo[dependencyName] : undefined);
    const wanted = (0, map_dependencies_1.getWantedVersion)(installed, outdatedInfo[dependencyName]);
    const latest = (0, map_dependencies_1.getLatestVersion)(installed, wanted, outdatedInfo[dependencyName]);
    return {
        manager: 'npm',
        required,
        name: dependencyName,
        type,
        installed,
        wanted,
        latest,
    };
};
const getPnpmPackageWithInfo = async (projectPath, dependencyName) => {
    // installed or not
    const [{ devDependencies: installedInfoDevelopment, dependencies: installedInfoRegular, },] = await (0, execute_command_1.executeCommandJSONWithFallback)(projectPath, `pnpm ls ${dependencyName} --depth=0 --json`);
    const installedInfo = {
        ...installedInfoDevelopment,
        ...installedInfoRegular,
    };
    // latest, wanted
    const outdatedInfo = {};
    await (0, pnpm_utils_1.executePnpmOutdated)(outdatedInfo, projectPath);
    await (0, pnpm_utils_1.executePnpmOutdated)(outdatedInfo, projectPath, true);
    // required & type
    const type = (0, get_project_package_json_1.getTypeFromPackageJson)(projectPath, dependencyName);
    const required = (0, get_project_package_json_1.getRequiredFromPackageJson)(projectPath, dependencyName);
    const installed = (0, map_dependencies_1.getInstalledVersion)(installedInfo[dependencyName]);
    const wanted = (0, map_dependencies_1.getWantedVersion)(installed, outdatedInfo[dependencyName]);
    const latest = (0, map_dependencies_1.getLatestVersion)(installed, wanted, outdatedInfo[dependencyName]);
    return {
        manager: 'pnpm',
        required,
        name: dependencyName,
        type,
        installed,
        wanted,
        latest,
    };
};
const getYarnPackageWithInfo = async (projectPath, dependencyName) => {
    // installed or not
    const { data: { trees: installedInfo }, } = await (0, execute_command_1.executeCommandJSONWithFallback)(projectPath, `yarn list --pattern ${dependencyName} --depth=0 --json`);
    // latest, wanted
    const outdatedInfo = await (0, execute_command_1.executeCommandJSONWithFallbackYarn)(projectPath, `yarn outdated ${dependencyName} --json`);
    const outdatedInfoExtracted = (0, yarn_utils_1.extractVersionFromYarnOutdated)(outdatedInfo);
    // required & type
    const type = (0, get_project_package_json_1.getTypeFromPackageJson)(projectPath, dependencyName);
    const required = (0, get_project_package_json_1.getRequiredFromPackageJson)(projectPath, dependencyName);
    const info = installedInfo.find((x) => x.name.split('@')[0] === dependencyName);
    const installed = info === null || info === void 0 ? void 0 : info.name.split('@')[1];
    const wanted = (0, map_dependencies_1.getWantedVersion)(installed, outdatedInfoExtracted[dependencyName]);
    const latest = (0, map_dependencies_1.getLatestVersion)(installed, wanted, outdatedInfoExtracted[dependencyName]);
    return {
        manager: 'yarn',
        required,
        name: dependencyName,
        type,
        installed,
        wanted,
        latest,
    };
};
const addNpmDependencies = async (projectPath, dependencies, type) => {
    // add list
    const dependenciesToInstall = dependencies.map((d) => `${d.name}${d.version ? `@${d.version}` : ''}`);
    const command = `npm install ${dependenciesToInstall.join(' ')} -${type === 'prod' ? 'P' : 'D'} --json`;
    await (0, execute_command_1.executeCommandSimple)(projectPath, command);
    if (dependencies.length === 1 && dependencies[0]) {
        return getNpmPackageWithInfo(projectPath, dependencies[0].name);
    }
    return undefined;
};
const addPnpmDependencies = async (projectPath, dependencies, type) => {
    // add list
    const dependenciesToInstall = dependencies.map((d) => `${d.name}${d.version ? `@${d.version}` : ''}`);
    const command = `pnpm install ${dependenciesToInstall.join(' ')} -${type === 'prod' ? 'P' : 'D'}`;
    await (0, execute_command_1.executeCommandSimple)(projectPath, command);
    if (dependencies.length === 1 && dependencies[0]) {
        return getPnpmPackageWithInfo(projectPath, dependencies[0].name);
    }
    return undefined;
};
const addYarnDependencies = async (projectPath, dependencies, type) => {
    // add list
    const dependenciesToInstall = dependencies.map((d) => `${d.name}${d.version ? `@${d.version}` : ''}`);
    const command = `yarn add ${dependenciesToInstall.join(' ')}${type === 'prod' ? '' : ' -D'}`;
    await (0, execute_command_1.executeCommandSimple)(projectPath, command);
    if (dependencies.length === 1 && dependencies[0]) {
        return getYarnPackageWithInfo(projectPath, dependencies[0].name);
    }
    return undefined;
};
const addDependencies = async ({ params: { type }, extraParams: { projectPathDecoded, manager, xCacheId }, body, }) => {
    let singleAddUpdate = undefined;
    if (manager === 'yarn') {
        singleAddUpdate = await addYarnDependencies(projectPathDecoded, body, type);
    }
    else if (manager === 'pnpm') {
        singleAddUpdate = await addPnpmDependencies(projectPathDecoded, body, type);
    }
    else {
        singleAddUpdate = await addNpmDependencies(projectPathDecoded, body, type);
    }
    if (singleAddUpdate) {
        (0, cache_1.updateInCache)(xCacheId + manager + projectPathDecoded, singleAddUpdate);
    }
    else {
        (0, cache_1.clearCache)(xCacheId + manager + projectPathDecoded);
    }
    return {};
};
exports.addDependencies = addDependencies;
