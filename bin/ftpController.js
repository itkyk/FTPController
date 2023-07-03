#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createEnv_1 = __importDefault(require("./createEnv"));
const ftpUploader_1 = require("./ftpUploader");
const { Command } = require('commander');
const program = new Command();
program
    .option("-i, --init", "Create template .env file.", false)
    .option("-d, --deploy [value]", "Upload server.")
    .option("-l, --list", "When end deploy, puts upload files on console.", false);
program.parse(process.argv);
const opts = program.opts();
if (opts.init === true) {
    (0, createEnv_1.default)();
}
else if (opts.deploy) {
    (0, ftpUploader_1.certification)(opts);
}
