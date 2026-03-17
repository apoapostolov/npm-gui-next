"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const parse_json_1 = require("../../utils/parse-json");
const request_with_promise_1 = require("../../utils/request-with-promise");
const search = async ({ body: { query } }) => {
    const response = await (0, request_with_promise_1.requestGET)('api.npms.io', `/v2/search?from=0&size=25&q=${query}`);
    const parsed = (0, parse_json_1.parseJSON)(response);
    if (!parsed) {
        throw new Error('Unable to get package info');
    }
    return parsed.results.map((result) => ({
        name: result.package.name,
        version: result.package.version,
        score: result.score.final,
        updated: result.package.date,
        npm: result.package.links.npm,
        repository: result.package.links.repository,
        homepage: result.package.links.homepage,
        description: result.package.description,
    }));
};
exports.search = search;
