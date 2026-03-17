"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notEmpty = exports.HTTP_STATUS_NOT_FOUND = exports.HTTP_STATUS_BAD_REQUEST = exports.HTTP_STATUS_OK = exports.ONE = exports.ZERO = void 0;
exports.ZERO = 0;
exports.ONE = 1;
exports.HTTP_STATUS_OK = 200;
exports.HTTP_STATUS_BAD_REQUEST = 400;
exports.HTTP_STATUS_NOT_FOUND = 404;
const notEmpty = (value) => {
    return value !== null && value !== undefined;
};
exports.notEmpty = notEmpty;
