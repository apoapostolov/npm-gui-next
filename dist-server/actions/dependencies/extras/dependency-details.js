"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDependenciesDetails = void 0;
const utils_1 = require("../../../utils/utils");
const execute_command_1 = require("../../execute-command");
const utils_2 = require("./utils");
const cache = {};
const extractNameFromDependencyString = (dependencyNameVersion) => {
    return dependencyNameVersion.slice(0, Math.max(0, dependencyNameVersion.lastIndexOf('@')));
};
const extractVersionFromDependencyString = (dependencyNameVersion) => {
    return dependencyNameVersion.slice(Math.max(0, dependencyNameVersion.lastIndexOf('@') + 1));
};
const getDependencyDetailsCross = async (dependencyNameVersion, manager) => {
    var _a, _b;
    const bundleInfoCached = cache[`${manager}-${dependencyNameVersion}`];
    if (bundleInfoCached) {
        return bundleInfoCached;
    }
    const details = await (0, execute_command_1.executeCommandJSONWithFallback)(undefined, `${manager} info ${dependencyNameVersion} --json`);
    // yarn has different structure
    const detailsData = manager === 'yarn' ? details.data : details;
    const name = extractNameFromDependencyString(dependencyNameVersion);
    const version = extractVersionFromDependencyString(dependencyNameVersion);
    // eslint-disable-next-line require-atomic-updates
    cache[`${manager}-${dependencyNameVersion}`] = {
        name,
        version,
        versions: detailsData.versions,
        homepage: detailsData.homepage,
        repository: (_a = detailsData.repository) === null || _a === void 0 ? void 0 : _a.url,
        size: +detailsData.dist.unpackedSize,
        time: detailsData.time,
        updated: detailsData.time.modified,
        created: detailsData.time.created,
    };
    return {
        name,
        version,
        versions: detailsData.versions,
        homepage: detailsData.homepage,
        repository: (_b = detailsData.repository) === null || _b === void 0 ? void 0 : _b.url,
        size: +detailsData.dist.unpackedSize,
        time: detailsData.time,
        updated: detailsData.time.modified,
        created: detailsData.time.created,
    };
};
const getDependenciesDetails = async ({ params: { dependenciesNameVersion, manager } }) => {
    const chunks = (0, utils_2.getChunks)(dependenciesNameVersion.split(','));
    try {
        const allDetails = [];
        for (const chunk of chunks) {
            const chunkDetails = await Promise.all(chunk.map((item) => getDependencyDetailsCross(item, manager)));
            allDetails.push(...chunkDetails.filter(utils_1.notEmpty));
        }
        return allDetails;
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return [];
    }
};
exports.getDependenciesDetails = getDependenciesDetails;
