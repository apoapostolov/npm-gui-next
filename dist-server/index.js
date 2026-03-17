"use strict";
/* eslint-disable import/max-dependencies */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.app = void 0;
const available_managers_1 = require("./actions/available-managers/available-managers");
const add_global_dependencies_1 = require("./actions/dependencies/add/add-global-dependencies");
const add_project_dependencies_1 = require("./actions/dependencies/add/add-project-dependencies");
const delete_global_dependencies_1 = require("./actions/dependencies/delete/delete-global-dependencies");
const delete_project_dependencies_1 = require("./actions/dependencies/delete/delete-project-dependencies");
const dependency_details_1 = require("./actions/dependencies/extras/dependency-details");
const dependency_score_1 = require("./actions/dependencies/extras/dependency-score");
const get_global_dependencies_1 = require("./actions/dependencies/get/get-global-dependencies");
const get_project_dependencies_1 = require("./actions/dependencies/get/get-project-dependencies");
const install_project_dependencies_1 = require("./actions/dependencies/install/install-project-dependencies");
const explorer_1 = require("./actions/explorer/explorer");
const info_1 = require("./actions/info/info");
const search_1 = require("./actions/search/search");
const project_path_and_manager_middleware_1 = require("./middlewares/project-path-and-manager.middleware");
const simple_express_1 = require("./simple-express");
const DEFAULT_PORT = 3001;
const DEFAULT_HOST = 'localhost';
exports.app = new simple_express_1.Server();
exports.app.use('/api/project/:projectPath/', project_path_and_manager_middleware_1.projectPathAndManagerMiddleware);
exports.app.get('/api/project/:projectPath/dependencies/simple', get_project_dependencies_1.getAllDependenciesSimple);
exports.app.get('/api/project/:projectPath/dependencies/full', get_project_dependencies_1.getAllDependencies);
exports.app.post('/api/project/:projectPath/dependencies/install/:forceManager', install_project_dependencies_1.installDependenciesForceManager);
exports.app.post('/api/project/:projectPath/dependencies/install', install_project_dependencies_1.installDependencies);
exports.app.post('/api/project/:projectPath/dependencies/:type', add_project_dependencies_1.addDependencies);
exports.app.delete('/api/project/:projectPath/dependencies/:type', delete_project_dependencies_1.deleteDependencies);
// global routes
exports.app.get('/api/global/dependencies/simple', get_global_dependencies_1.getGlobalDependenciesSimple);
exports.app.get('/api/global/dependencies/full', get_global_dependencies_1.getGlobalDependencies);
exports.app.post('/api/global/dependencies', add_global_dependencies_1.addGlobalDependencies);
exports.app.delete('/api/global/dependencies/global/:dependencyName', delete_global_dependencies_1.deleteGlobalDependency);
// dependencies extra apis
exports.app.get('/api/score/:dependenciesName', dependency_score_1.getDependenciesScore);
exports.app.get('/api/details/:manager/:dependenciesNameVersion', dependency_details_1.getDependenciesDetails);
// other apis
exports.app.get('/api/explorer/:path', explorer_1.explorer);
exports.app.get('/api/explorer/', explorer_1.explorer);
exports.app.get('/api/available-managers', available_managers_1.availableManagers);
exports.app.post('/api/search/:repoName', search_1.search);
exports.app.get('/api/info/:id', info_1.info);
/* istanbul ignore next */
const start = (host = DEFAULT_HOST, port = DEFAULT_PORT, openBrowser = false) => {
    exports.app.listen(port, host);
    if (openBrowser) {
        void Promise.resolve().then(() => __importStar(require('open'))).then(({ default: open }) => {
            void open(`http://${host}:${port}`);
        });
    }
};
exports.start = start;
// only for parcel?
// eslint-disable-next-line import/no-commonjs
module.exports = { start: exports.start, app: exports.app };
