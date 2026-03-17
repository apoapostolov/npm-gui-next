"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCache = exports.spliceFromCache = exports.updateInCache = exports.putToCache = exports.getFromCache = void 0;
const utils_1 = require("./utils");
let cache = {};
const getFromCache = (name) => {
    return cache[name];
};
exports.getFromCache = getFromCache;
const putToCache = (name, data) => {
    cache[name] = data;
};
exports.putToCache = putToCache;
const updateInCache = (name, dependency) => {
    const myCache = cache[name];
    if (myCache) {
        const indexToUpdate = myCache.findIndex((item) => dependency.name === item.name);
        if (indexToUpdate >= utils_1.ZERO) {
            myCache[indexToUpdate] = dependency;
        }
        else {
            myCache.push(dependency);
        }
    }
};
exports.updateInCache = updateInCache;
const spliceFromCache = (name, dependencyName) => {
    const myCache = cache[name];
    if (myCache) {
        const indexToSplice = myCache.findIndex((item) => dependencyName === item.name);
        if (indexToSplice >= utils_1.ZERO) {
            myCache.splice(indexToSplice, utils_1.ONE);
        }
    }
};
exports.spliceFromCache = spliceFromCache;
const clearCache = (name) => {
    if (name === undefined) {
        cache = {};
    }
    else {
        (0, exports.putToCache)(name);
    }
};
exports.clearCache = clearCache;
