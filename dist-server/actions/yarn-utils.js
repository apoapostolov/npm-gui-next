"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractVersionFromYarnOutdated = void 0;
const extractVersionFromYarnOutdated = (outdatedInfo) => {
    if (!outdatedInfo || !outdatedInfo.data) {
        return {};
    }
    const nameIndex = outdatedInfo.data.head.indexOf('Package');
    const wantedIndex = outdatedInfo.data.head.indexOf('Wanted');
    const latestIndex = outdatedInfo.data.head.indexOf('Latest');
    const currentIndex = outdatedInfo.data.head.indexOf('Current');
    const dependencies = {};
    for (const packageArray of outdatedInfo.data.body) {
        const name = packageArray[nameIndex];
        dependencies[name] = {
            wanted: packageArray[wantedIndex],
            latest: packageArray[latestIndex],
            current: packageArray[currentIndex],
        };
    }
    return dependencies;
};
exports.extractVersionFromYarnOutdated = extractVersionFromYarnOutdated;
