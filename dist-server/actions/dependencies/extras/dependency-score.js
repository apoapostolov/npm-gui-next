"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDependenciesScore = void 0;
const parse_json_1 = require("../../../utils/parse-json");
const request_with_promise_1 = require("../../../utils/request-with-promise");
const utils_1 = require("../../../utils/utils");
const utils_2 = require("./utils");
const cache = {};
const getDependenciesScoreValue = async (dependencyName) => {
    var _a;
    const bundleInfoCached = cache[dependencyName];
    if (bundleInfoCached) {
        return bundleInfoCached;
    }
    try {
        const response = await (0, request_with_promise_1.requestGET)('api.npms.io', `/v2/package/${dependencyName}`);
        const parsed = (0, parse_json_1.parseJSON)(response);
        const score = (_a = parsed === null || parsed === void 0 ? void 0 : parsed.score) === null || _a === void 0 ? void 0 : _a.final;
        if (typeof score === 'number') {
            // eslint-disable-next-line require-atomic-updates
            cache[dependencyName] = {
                name: dependencyName,
                score: Math.round(score * 100),
            };
            return cache[dependencyName];
        }
        return undefined;
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return undefined;
    }
};
const getDependenciesScore = async ({ params: { dependenciesName } }) => {
    const chunks = (0, utils_2.getChunks)(dependenciesName.split(','), 5);
    try {
        const allScore = [];
        for (const chunk of chunks) {
            const chunkScore = await Promise.all(chunk.map((dependencyName) => getDependenciesScoreValue(dependencyName)));
            allScore.push(...chunkScore.filter(utils_1.notEmpty));
        }
        return allScore;
    }
    catch (_a) {
        return [];
    }
};
exports.getDependenciesScore = getDependenciesScore;
