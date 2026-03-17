"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.availableManagers = void 0;
const execute_command_1 = require("../execute-command");
const availableManagers = async () => {
    let npm = true;
    let yarn = true;
    let pnpm = true;
    try {
        await (0, execute_command_1.executeCommandSimple)(undefined, 'npm --version');
    }
    catch (_a) {
        npm = false;
    }
    try {
        await (0, execute_command_1.executeCommandSimple)(undefined, 'yarn --version');
    }
    catch (_b) {
        yarn = false;
    }
    try {
        await (0, execute_command_1.executeCommandSimple)(undefined, 'pnpm --version');
    }
    catch (_c) {
        pnpm = false;
    }
    return {
        npm,
        pnpm,
        yarn,
    };
};
exports.availableManagers = availableManagers;
