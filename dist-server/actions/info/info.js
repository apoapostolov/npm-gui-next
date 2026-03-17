"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.info = void 0;
const fs_1 = require("fs");
const info = async ({ params: { id: _id }, }) => {
    return (0, fs_1.readFileSync)(`${process.cwd()}/INFO`, 'utf-8');
};
exports.info = info;
