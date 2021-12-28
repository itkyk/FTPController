#!/usr/bin/env node

import init from "./createEnv";
import certification from "./ftpUploader";

const { Command } = require('commander');
const program = new Command();
program
    .option("-i, --init", "create template .env file")
    .option("-d, --deploy [value]", "push server")
program.parse(process.argv);




const opts = program.opts();
if (opts.init === true) {
    init();
} else if (opts.deploy) {
    certification(opts);
}