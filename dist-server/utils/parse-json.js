"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJSON = void 0;
const parseJSON = (stringToParse) => {
    let result = null;
    try {
        result = JSON.parse(stringToParse);
    }
    catch (_a) {
        // eslint-disable-next-line no-console
        console.error('JSON error', stringToParse, '#');
        return null;
    }
    return result;
};
exports.parseJSON = parseJSON;
