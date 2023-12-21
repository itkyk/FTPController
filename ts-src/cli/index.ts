#!/usr/bin/env node
import {Command} from "commander";
import {upload} from "../deploy";
import {createConfig} from "../createConfig";

interface OptsInterface {
  deploy?: string;
  project: string;
  init?: boolean;
}

const program = new Command();

program
  .option("-d, --deploy <value>", "input select stage.\nデプロイするターゲットを入力してください。")
  .option("-P, --project <value>", "Specify the path to \"ftp.config.ts\".\nftp.config.tsファイルまでのパスを指定します。", "./ftp.config.ts")
  .option("-i, --init", "create template config file.\n設定ファイルの雛形を作成します。");
program.parse();

const opts = program.opts() as OptsInterface;

if (opts.deploy) {
  upload(opts.deploy, opts.project);
} else if (opts.init) {
  createConfig();
} else {

}