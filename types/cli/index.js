#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const deploy_1 = require("../deploy");
const createConfig_1 = require("../createConfig");
const program = new commander_1.Command();
program
    .option("-d, --deploy <value>", "input select stage.\nデプロイするターゲットを入力してください。")
    .option("-P, --project <value>", "Specify the path to \"ftp.config.ts\".\nftp.config.tsファイルまでのパスを指定します。", "./ftp.config.ts")
    .option("-i, --init", "create template config file.\n設定ファイルの雛形を作成します。");
program.parse();
const opts = program.opts();
if (opts.deploy) {
    (0, deploy_1.upload)(opts.deploy, opts.project);
}
else if (opts.init) {
    (0, createConfig_1.createConfig)();
}
else {
}
