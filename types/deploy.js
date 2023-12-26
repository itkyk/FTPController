"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const index_1 = require("../lib/index");
const interpret_1 = require("interpret");
const rechoir_1 = __importDefault(require("rechoir"));
const path = __importStar(require("path"));
const getConfig = async (configPath) => {
    const ext = path.extname(configPath);
    const interpreted = Object.keys(interpret_1.jsVariants).find((variant) => variant === ext);
    if (interpreted) {
        try {
            rechoir_1.default.prepare(interpret_1.extensions, configPath);
            const { default: config } = require(path.resolve(configPath));
            return Promise.resolve(config);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
};
const upload = async (target, project) => {
    try {
        const config = await getConfig(project);
        if (!config || !config[target])
            throw new Error("Cannot find Config Data");
        const stageData = config[target];
        (0, index_1.deploy)(stageData.localRoot, stageData.remoteRoot, stageData.host, stageData.password, stageData.user, String(stageData.port || 21), stageData.deleteRemote || false);
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
};
exports.upload = upload;
