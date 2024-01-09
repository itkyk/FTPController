"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templateConfig = `import { defineConfig } from "@itkyk/ftp-controller";

export default defineConfig({
  preview: {
    host: "",
    user: "",
    password: "",
    localRoot: "",
    remoteRoot: "",
  },
   staging: {
    host: "",
    user: "",
    password: "",
    localRoot: "",
    remoteRoot: "",
  }
});`;
exports.default = templateConfig;
