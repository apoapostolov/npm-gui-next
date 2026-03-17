"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executePnpmOutdated = void 0;
const execute_command_1 = require("./execute-command");
const ansiRegex = () => {
    const pattern = [
        '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
        '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))',
    ].join('|');
    return new RegExp(pattern, 'g');
};
const executePnpmOutdated = async (outdatedInfo, projectPath, compatible = false) => {
    try {
        await (0, execute_command_1.executeCommandSimple)(projectPath, `pnpm outdated ${compatible ? '--compatible' : ''} --no-table`);
    }
    catch (error) {
        if (typeof error === 'string') {
            const rows = error.replace(ansiRegex(), '').split('\n');
            let name = '';
            for (const row of rows) {
                const rowResult = /=>.([\d.]+)/.exec(row);
                if (rowResult) {
                    outdatedInfo[name] = {
                        ...outdatedInfo[name],
                        [compatible ? 'wanted' : 'latest']: rowResult[1],
                    };
                }
                else {
                    name = row.replace('(dev)', '').trim();
                }
            }
        }
    }
};
exports.executePnpmOutdated = executePnpmOutdated;
