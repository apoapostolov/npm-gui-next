"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
/* eslint-disable max-statements */
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils/utils");
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'vnd/ms-fontobject',
    '.otf': 'font/otf',
    '.wasm': 'application/wasm',
    '.map': 'application/json',
    '.css.map': 'application/json',
    '.js.map': 'application/json',
};
class Server {
    constructor() {
        this.middlewares = [];
        this.responsers = [];
        this.server = http_1.default.createServer(this.onIncomingMessage.bind(this));
    }
    static parseUrlParams(middlewarePath, requestUrl) {
        const splitted = middlewarePath.split(/:\w+/g).filter((value) => value);
        const parametersValues = splitted
            // eslint-disable-next-line unicorn/no-array-reduce
            .reduce((url, split) => url.replace(split, '|'), requestUrl)
            .split('|')
            .filter((value) => value);
        const parametersNames = middlewarePath.match(/:\w+/g);
        const parameters = parametersNames === null || parametersNames === void 0 ? void 0 : parametersNames.reduce((previousParameters, parameterName, index) => ({
            ...previousParameters,
            [parameterName.replace(':', '')]: parametersValues[index],
        }), {});
        return parameters !== null && parameters !== void 0 ? parameters : {};
    }
    static async readBody(request) {
        return new Promise((resolve) => {
            let data = '';
            request.on('data', (chunk) => {
                data += chunk;
            });
            request.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                }
                catch (_a) {
                    resolve({});
                }
            });
        });
    }
    static normalizeError(error, request) {
        const base = {
            method: request.method,
            url: request.url,
        };
        if (error instanceof Error) {
            return {
                ...base,
                message: error.message,
                name: error.name,
                stack: error.stack,
            };
        }
        if (typeof error === 'string') {
            return {
                ...base,
                message: 'Command execution failed',
                details: error,
            };
        }
        if (error && typeof error === 'object') {
            return {
                ...base,
                message: 'Request handling failed',
                ...error,
            };
        }
        return {
            ...base,
            message: 'Unknown server error',
            details: error,
        };
    }
    listen(port, host) {
        this.server.listen(port, host);
        // eslint-disable-next-line no-console
        console.log('listening on:', host, port);
    }
    use(url, callback) {
        this.middlewares.push({
            url,
            callback,
        });
    }
    get(url, callback) {
        this.responsers.push({
            url,
            method: 'GET',
            callback,
        });
    }
    post(url, callback) {
        this.responsers.push({
            url,
            method: 'POST',
            callback,
        });
    }
    delete(url, callback) {
        this.responsers.push({
            url,
            method: 'DELETE',
            callback,
        });
    }
    any(url, callback) {
        this.responsers.push({
            url,
            callback,
        });
    }
    async onIncomingMessage(request, response) {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-cache-id');
        if (request.method === 'OPTIONS') {
            response.writeHead(utils_1.HTTP_STATUS_OK);
            response.end();
            return;
        }
        let extraParameters = {
            xCacheId: request.headers['x-cache-id'],
        };
        const bodyJSON = await Server.readBody(request);
        try {
            for (const middleware of this.middlewares) {
                const pathRegex = new RegExp(middleware.url.replace(/:\w+/g, '.+'));
                if (request.url !== undefined && pathRegex.test(request.url)) {
                    const parameters = Server.parseUrlParams(middleware.url, request.url);
                    const myExtraParameters = middleware.callback({
                        params: parameters,
                        extraParams: extraParameters,
                    });
                    extraParameters = { ...extraParameters, ...myExtraParameters };
                }
            }
            for (const responser of this.responsers) {
                const pathRegex = new RegExp(responser.url.replace(/:\w+/g, '.+'));
                const isMethodOk = responser.method === undefined || responser.method === request.method;
                if (!response.headersSent &&
                    request.url !== undefined &&
                    isMethodOk &&
                    pathRegex.test(request.url)) {
                    const parameters = Server.parseUrlParams(responser.url, request.url);
                    // eslint-disable-next-line no-await-in-loop
                    const data = await responser.callback({
                        params: parameters,
                        extraParams: extraParameters,
                        body: bodyJSON,
                    });
                    if (typeof data === 'string') {
                        response.writeHead(utils_1.HTTP_STATUS_OK, { 'Content-Type': 'text/html' });
                        response.write(data, 'utf-8');
                    }
                    else {
                        response.writeHead(utils_1.HTTP_STATUS_OK, {
                            'Content-Type': 'application/json',
                        });
                        response.write(JSON.stringify(data), 'utf-8');
                    }
                }
            }
        }
        catch (error) {
            const errorPayload = Server.normalizeError(error, request);
            if (!process.env['NODE_TEST']) {
                console.error('ERROR HANDLER', errorPayload);
            }
            response.writeHead(utils_1.HTTP_STATUS_BAD_REQUEST, {
                'Content-Type': 'application/json',
            });
            response.write(JSON.stringify(errorPayload), 'utf-8');
        }
        if (!response.headersSent && request.url !== undefined) {
            // static
            const pathToFile = path_1.default.join(__dirname, '../', request.url);
            if (request.url === '/') {
                // index.html
                response.write(fs_1.default.readFileSync(path_1.default.join(__dirname, '../', 'client', 'index.html'), 'utf-8'));
            }
            else if (fs_1.default.existsSync(pathToFile)) {
                const extname = path_1.default
                    .extname(pathToFile)
                    .toLowerCase();
                const contentType = mimeTypes[extname];
                response.writeHead(utils_1.HTTP_STATUS_OK, { 'Content-Type': contentType });
                response.write(fs_1.default.readFileSync(pathToFile, contentType.includes('text') ? 'utf-8' : undefined));
            }
            else {
                // 404 always return index.html
                response.write(fs_1.default.readFileSync(path_1.default.join(__dirname, '../', 'client', 'index.html'), 'utf-8'));
            }
        }
        response.end();
    }
}
exports.Server = Server;
