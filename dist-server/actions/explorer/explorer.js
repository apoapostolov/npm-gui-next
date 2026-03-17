"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.explorer = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const project_path_and_manager_middleware_1 = require("../../middlewares/project-path-and-manager.middleware");
const explorer = ({ params }) => {
    let normalizedPath = params.path !== undefined ? path_1.default.normalize((0, project_path_and_manager_middleware_1.decodePath)(params.path)) : null;
    let changed = false;
    if (normalizedPath === null || !(0, fs_1.existsSync)(normalizedPath)) {
        normalizedPath = process.cwd();
        changed = true;
    }
    const ls = (0, fs_1.readdirSync)(normalizedPath).map((name) => ({
        name,
        isDirectory: (0, fs_1.lstatSync)(`${normalizedPath}/${name}`).isDirectory(),
        isProject: [
            'package.json',
            'package-lock.json',
            'yarn.lock',
            'pnpm-lock.yaml',
        ].includes(name),
    }));
    return {
        ls,
        changed,
        path: normalizedPath,
    };
};
exports.explorer = explorer;
