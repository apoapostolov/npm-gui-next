"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFolderRecursive = void 0;
const fs_1 = require("fs");
const deleteFolderRecursive = (rmPath) => {
    let files = [];
    if ((0, fs_1.existsSync)(rmPath)) {
        files = (0, fs_1.readdirSync)(rmPath);
        for (const [, file] of files.entries()) {
            const currentPath = `${rmPath}/${file}`;
            if ((0, fs_1.lstatSync)(currentPath).isDirectory()) {
                // recurse
                (0, exports.deleteFolderRecursive)(currentPath);
            }
            else {
                // delete file
                (0, fs_1.unlinkSync)(currentPath);
            }
        }
        (0, fs_1.rmdirSync)(rmPath);
    }
};
exports.deleteFolderRecursive = deleteFolderRecursive;
