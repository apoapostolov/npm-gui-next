"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeCommandSimple = exports.executeCommand = void 0;
exports.executeCommandJSONWithFallback = executeCommandJSONWithFallback;
exports.executeCommandJSONWithFallbackYarn = executeCommandJSONWithFallbackYarn;
const simple_cross_spawn_1 = require("../utils/simple-cross-spawn");
const utils_1 = require("../utils/utils");
const executeCommand = (cwd, wholeCommand) => {
    console.log(`Command: ${wholeCommand}, started`);
    return new Promise((resolve, reject) => {
        var _a, _b;
        // spawn process
        const commandArguments = wholeCommand.split(' ');
        const command = commandArguments.shift();
        if (!command) {
            reject(new Error('command not passed'));
        }
        else {
            const spawned = (0, simple_cross_spawn_1.spawn)(command, commandArguments, {
                cwd,
                detached: false,
            });
            // wait for stdout, stderr
            let stdout = '';
            (_a = spawned.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (data) => {
                stdout += data.toString();
            });
            let stderr = '';
            (_b = spawned.stderr) === null || _b === void 0 ? void 0 : _b.on('data', (data) => {
                stderr += data.toString();
            });
            // wait for finish and resolve
            spawned.on('close', (exitStatus) => {
                if (exitStatus === utils_1.ZERO) {
                    resolve({
                        stdout,
                        stderr,
                    });
                }
                else {
                    reject(stdout + stderr);
                }
            });
            // if error
            spawned.on('error', () => {
                reject(stderr);
            });
        }
    });
};
exports.executeCommand = executeCommand;
const executeCommandSimple = async (cwd, wholeCommand) => {
    const { stdout } = await (0, exports.executeCommand)(cwd, wholeCommand);
    return stdout;
};
exports.executeCommandSimple = executeCommandSimple;
// eslint-disable-next-line func-style
async function executeCommandJSONWithFallback(cwd, wholeCommand) {
    try {
        const { stdout } = await (0, exports.executeCommand)(cwd, wholeCommand);
        if (!process.env['NODE_TEST']) {
            console.log('OK:', wholeCommand);
        }
        return stdout ? JSON.parse(stdout) : {};
    }
    catch (error) {
        if (!process.env['NODE_TEST']) {
            console.log('ERROR:', wholeCommand, '\n', error);
        }
        return JSON.parse(error.replace(/(\n{[\S\s]+)?npm ERR[\S\s]+/gm, ''));
    }
}
// eslint-disable-next-line func-style, max-statements
async function executeCommandJSONWithFallbackYarn(cwd, wholeCommand) {
    try {
        const { stdout, stderr } = await (0, exports.executeCommand)(cwd, wholeCommand);
        if (!process.env['NODE_TEST']) {
            console.log('OK:', wholeCommand);
        }
        const JSONs = (stdout + stderr)
            .trim()
            .split('\n')
            .filter((x) => x)
            .map((r) => JSON.parse(r));
        const table = JSONs.find((x) => 'type' in x && x.type === 'table');
        if (table) {
            return table;
        }
        const anyError = JSONs.find((x) => 'type' in x && x.type === 'error');
        if (anyError) {
            return anyError;
        }
    }
    catch (error) {
        if (!process.env['NODE_TEST']) {
            console.log('ERROR:', wholeCommand, '\n', error);
        }
        if (typeof error === 'string') {
            const JSONS = error
                .trim()
                .split('\n')
                .filter((x) => x)
                .map((r) => JSON.parse(r));
            const table = JSONS.find((x) => 'type' in x && x.type === 'table');
            if (table) {
                return table;
            }
            const anyError = JSONS.find((x) => 'type' in x && x.type === 'error');
            if (anyError) {
                return anyError;
            }
        }
        return JSON.parse(error);
    }
    return undefined;
}
