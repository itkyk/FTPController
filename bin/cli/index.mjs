#!/usr/bin/env node
import { Command } from "commander";
import { upload } from "../deploy";
import { createConfig } from "../createConfig";
const program = new Command();
program.option("-d, --deploy <value>", "input select stage.\n\u30C7\u30D7\u30ED\u30A4\u3059\u308B\u30BF\u30FC\u30B2\u30C3\u30C8\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002").option("-P, --project <value>", 'Specify the path to "ftp.config.ts".\nftp.config.ts\u30D5\u30A1\u30A4\u30EB\u307E\u3067\u306E\u30D1\u30B9\u3092\u6307\u5B9A\u3057\u307E\u3059\u3002', "./ftp.config.ts").option("-i, --init", "create template config file.\n\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E\u96DB\u5F62\u3092\u4F5C\u6210\u3057\u307E\u3059\u3002");
program.parse();
const opts = program.opts();
if (opts.deploy) {
  upload(opts.deploy, opts.project);
} else if (opts.init) {
  createConfig();
} else {
}
