"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequiredFromPackageJson = exports.getTypeFromPackageJson = exports.getAllDependenciesFromPackageJsonAsArray = exports.getDevelopmentDependenciesFromPackageJson = exports.getDependenciesFromPackageJson = exports.getProjectPackageJSON = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const parse_json_1 = require("./parse-json");
const getProjectPackageJSON = (projectPath) => {
    const packageJSONpath = path_1.default.join(projectPath, 'package.json');
    if ((0, fs_1.existsSync)(packageJSONpath)) {
        return (0, parse_json_1.parseJSON)((0, fs_1.readFileSync)(packageJSONpath, { encoding: 'utf8' }));
    }
    return null;
};
exports.getProjectPackageJSON = getProjectPackageJSON;
const getDependenciesFromPackageJson = (projectPath) => {
    var _a;
    const packageJson = (0, exports.getProjectPackageJSON)(projectPath);
    if (packageJson === null || !('dependencies' in packageJson)) {
        return {};
    }
    return (_a = packageJson.dependencies) !== null && _a !== void 0 ? _a : {};
};
exports.getDependenciesFromPackageJson = getDependenciesFromPackageJson;
const getDevelopmentDependenciesFromPackageJson = (projectPath) => {
    var _a;
    const packageJson = (0, exports.getProjectPackageJSON)(projectPath);
    if (packageJson === null || !('devDependencies' in packageJson)) {
        return {};
    }
    return (_a = packageJson.devDependencies) !== null && _a !== void 0 ? _a : {};
};
exports.getDevelopmentDependenciesFromPackageJson = getDevelopmentDependenciesFromPackageJson;
const getAllDependenciesFromPackageJsonAsArray = (projectPath, manager) => {
    const dependencies = (0, exports.getDependenciesFromPackageJson)(projectPath);
    const devDependencies = (0, exports.getDevelopmentDependenciesFromPackageJson)(projectPath);
    return [
        ...Object.entries(dependencies).map(([name, required]) => ({
            manager,
            name,
            type: 'prod',
            required,
        })),
        ...Object.entries(devDependencies).map(([name, required]) => ({
            manager,
            name,
            type: 'dev',
            required,
        })),
    ];
};
exports.getAllDependenciesFromPackageJsonAsArray = getAllDependenciesFromPackageJsonAsArray;
const getTypeFromPackageJson = (projectPath, dependencyName) => {
    const packageJson = (0, exports.getProjectPackageJSON)(projectPath);
    if (packageJson === null) {
        console.log('ERROR????');
        return 'extraneous';
    }
    const { dependencies, devDependencies } = packageJson;
    if (dependencies && dependencyName in dependencies) {
        return 'prod';
    }
    if (devDependencies && dependencyName in devDependencies) {
        return 'dev';
    }
    return 'extraneous';
};
exports.getTypeFromPackageJson = getTypeFromPackageJson;
const getRequiredFromPackageJson = (projectPath, dependencyName) => {
    const packageJson = (0, exports.getProjectPackageJSON)(projectPath);
    if (packageJson === null) {
        return undefined;
    }
    const { dependencies, devDependencies } = packageJson;
    if (dependencies && dependencyName in dependencies) {
        return dependencies[dependencyName];
    }
    if (devDependencies && dependencyName in devDependencies) {
        return devDependencies[dependencyName];
    }
    return undefined;
};
exports.getRequiredFromPackageJson = getRequiredFromPackageJson;
