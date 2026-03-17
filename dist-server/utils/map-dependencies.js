"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestVersion = exports.getWantedVersion = exports.getInstalledVersion = exports.uniqueOrNull = void 0;
const uniqueOrNull = (value, comparision) => {
    if (value === undefined) {
        return null;
    }
    return comparision.includes(value) ? null : value;
};
exports.uniqueOrNull = uniqueOrNull;
// eslint-disable-next-line max-statements
const getInstalledVersion = (installed) => {
    if (!installed) {
        return null;
    }
    if ('version' in installed) {
        return installed.version;
    }
    if ('invalid' in installed) {
        return null;
    }
    if ('missing' in installed) {
        return null;
    }
    if ('extraneous' in installed) {
        return null;
    }
    if (!('required' in installed)) {
        return null;
    }
    if (typeof installed.required === 'string') {
        return null;
    }
    // TODO peerMissing ERROR HERE
    return installed.required.version;
};
exports.getInstalledVersion = getInstalledVersion;
const getWantedVersion = (installed, outdated) => {
    if (installed === null || !outdated) {
        return null;
    }
    return (0, exports.uniqueOrNull)(outdated.wanted, [installed]);
};
exports.getWantedVersion = getWantedVersion;
const getLatestVersion = (installed, wanted, outdated) => {
    if (installed === null || !outdated) {
        return null;
    }
    return (0, exports.uniqueOrNull)(outdated.latest, [installed, wanted]);
};
exports.getLatestVersion = getLatestVersion;
