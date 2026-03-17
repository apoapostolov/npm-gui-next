"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectPathAndManagerMiddleware = exports.isNpmProject = exports.isPnpmProject = exports.isYarnProject = exports.decodePath = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const decodePath = (pathEncoded) => {
    return path_1.default.normalize(Buffer.from(pathEncoded, 'base64').toString());
};
exports.decodePath = decodePath;
const isYarnProject = (projectPath) => {
    return (0, fs_1.existsSync)(path_1.default.join(projectPath, 'yarn.lock'));
};
exports.isYarnProject = isYarnProject;
const isPnpmProject = (projectPath) => {
    return (0, fs_1.existsSync)(path_1.default.join(projectPath, 'pnpm-lock.yaml'));
};
exports.isPnpmProject = isPnpmProject;
const isNpmProject = (projectPath) => {
    return (0, fs_1.existsSync)(path_1.default.join(projectPath, 'package.json'));
};
exports.isNpmProject = isNpmProject;
const projectPathAndManagerMiddleware = ({ params: { projectPath } }) => {
    const projectPathDecoded = (0, exports.decodePath)(projectPath);
    const isYarn = (0, exports.isYarnProject)(projectPathDecoded);
    const isNpm = (0, exports.isNpmProject)(projectPathDecoded);
    const isPnpm = (0, exports.isPnpmProject)(projectPathDecoded);
    if (!isYarn && !isNpm && !isPnpm) {
        throw new Error('invalid project structure!');
    }
    // default
    let manager = 'npm';
    if (isPnpm) {
        // special
        manager = 'pnpm';
    }
    else if (isYarn) {
        manager = 'yarn';
    }
    return {
        projectPathDecoded,
        manager,
        xCache: 'any',
    };
};
exports.projectPathAndManagerMiddleware = projectPathAndManagerMiddleware;
