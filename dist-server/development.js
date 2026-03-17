"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
// eslint-disable-next-line prefer-destructuring
const hostAndPort = process.argv[2];
const [host, port] = (_a = hostAndPort === null || hostAndPort === void 0 ? void 0 : hostAndPort.split(':')) !== null && _a !== void 0 ? _a : ['localhost', '3001'];
(0, index_1.start)(host, typeof port === 'string' ? Number.parseInt(port, 10) : undefined);
