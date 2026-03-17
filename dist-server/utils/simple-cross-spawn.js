"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawn = void 0;
const child_process_1 = require("child_process");
const metaCharsRegExp = /([ !"%&()*,;<>?[\]^`|])/g;
const spawn = (command, arguments_, options) => {
    if (process.platform !== 'win32') {
        return (0, child_process_1.spawn)(command, arguments_, options);
    }
    const shellCommand = [
        command,
        ...(arguments_ || []).map((argument) => `"${argument}"`.replace(metaCharsRegExp, '^$1')),
    ].join(' ');
    return (0, child_process_1.spawn)(process.env['comspec'] || 'cmd.exe', ['/d', '/s', '/c', `"${shellCommand}"`], {
        ...options,
        windowsVerbatimArguments: true,
    });
};
exports.spawn = spawn;
