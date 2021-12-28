#!/usr/bin/env node

import init from "./createEnv";
import certification from "./ftpUploader";

const { Command } = require('commander');
const program = new Command();
program
    .option("-i, --init", "Create template .env file.", false)
    .option("-d, --deploy [value]", "Upload server.")
    .option("-l, --list", "When end deploy, puts upload files on console.", true)
program.parse(process.argv);




const opts = program.opts();
if (opts.init === true) {
    init();
} else if (opts.deploy) {
    certification(opts);
}