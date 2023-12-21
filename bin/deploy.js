"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var deploy_exports = {};
__export(deploy_exports, {
  upload: () => upload
});
module.exports = __toCommonJS(deploy_exports);
var import_lib = require("../lib/index");
var import_interpret = require("interpret");
var import_rechoir = __toESM(require("rechoir"));
var path = __toESM(require("path"));
const getConfig = async (configPath) => {
  const ext = path.extname(configPath);
  const interpreted = Object.keys(import_interpret.jsVariants).find(
    (variant) => variant === ext
  );
  if (interpreted) {
    try {
      import_rechoir.default.prepare(import_interpret.extensions, configPath);
      const { default: config } = require(path.resolve(configPath));
      return Promise.resolve(config);
    } catch (error) {
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
    (0, import_lib.deploy)(stageData.localRoot, stageData.remoteRoot, stageData.host, stageData.password, stageData.user, String(stageData.port || 21), stageData.deleteRemote || false);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  upload
});
