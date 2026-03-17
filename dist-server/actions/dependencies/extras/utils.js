"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChunks = void 0;
const getChunks = (array, chunkSize = 10) => {
    const chunks = [];
    for (let index = 0; index < array.length; index += chunkSize) {
        const chunk = array.slice(index, index + chunkSize);
        // do whatever
        chunks.push(chunk);
    }
    return chunks;
};
exports.getChunks = getChunks;
