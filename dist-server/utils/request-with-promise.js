"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestGET = void 0;
const https_1 = __importDefault(require("https"));
const requestGET = (hostname, path) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname,
            port: 443,
            path: encodeURI(path),
            method: 'GET',
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'User-Agent': 'npm-gui-next',
            },
        };
        const request = https_1.default.request(options, (response) => {
            let responseData = '';
            response.on('data', (data) => {
                responseData += data.toString();
            });
            response.on('end', () => {
                resolve(responseData);
            });
        });
        request.on('error', (error) => {
            reject(error);
        });
        request.end();
    });
};
exports.requestGET = requestGET;
