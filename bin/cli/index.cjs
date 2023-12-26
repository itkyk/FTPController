#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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

// lib/index.js
var require_lib = __commonJS({
  "lib/index.js"(exports2, module2) {
    "use strict";
    var { existsSync, readFileSync } = require("fs");
    var { join } = require("path");
    var { platform, arch } = process;
    var nativeBinding = null;
    var localFileExisted = false;
    var loadError = null;
    function isMusl() {
      if (!process.report || typeof process.report.getReport !== "function") {
        try {
          const lddPath = require("child_process").execSync("which ldd").toString().trim();
          return readFileSync(lddPath, "utf8").includes("musl");
        } catch (e) {
          return true;
        }
      } else {
        const { glibcVersionRuntime } = process.report.getReport().header;
        return !glibcVersionRuntime;
      }
    }
    switch (platform) {
      case "android":
        switch (arch) {
          case "arm64":
            localFileExisted = existsSync(join(__dirname, "ftp-controller.android-arm64.node"));
            try {
              if (localFileExisted) {
                nativeBinding = require("./ftp-controller.android-arm64.node");
              } else {
                nativeBinding = require("@itkyk/ftp-controller-android-arm64");
              }
            } catch (e) {
              loadError = e;
            }
            break;
          case "arm":
            localFileExisted = existsSync(join(__dirname, "ftp-controller.android-arm-eabi.node"));
            try {
              if (localFileExisted) {
                nativeBinding = require("./ftp-controller.android-arm-eabi.node");
              } else {
                nativeBinding = require("@itkyk/ftp-controller-android-arm-eabi");
              }
            } catch (e) {
              loadError = e;
            }
            break;
          default:
            throw new Error(`Unsupported architecture on Android ${arch}`);
        }
        break;
      case "win32":
        switch (arch) {
          case "x64":
            localFileExisted = existsSync(
              join(__dirname, "ftp-controller.win32-x64-msvc.node")
            );
            try {
              if (localFileExisted) {
                nativeBinding = require("./ftp-controller.win32-x64-msvc.node");
              } else {
                nativeBinding = require("@itkyk/ftp-controller-win32-x64-msvc");
              }
            } catch (e) {
              loadError = e;
            }
            break;
          case "ia32":
            localFileExisted = existsSync(
              join(__dirname, "ftp-controller.win32-ia32-msvc.node")
            );
            try {
              if (localFileExisted) {
                nativeBinding = require("./ftp-controller.win32-ia32-msvc.node");
              } else {
                nativeBinding = require("@itkyk/ftp-controller-win32-ia32-msvc");
              }
            } catch (e) {
              loadError = e;
            }
            break;
          case "arm64":
            localFileExisted = existsSync(
              join(__dirname, "ftp-controller.win32-arm64-msvc.node")
            );
            try {
              if (localFileExisted) {
                nativeBinding = require("./ftp-controller.win32-arm64-msvc.node");
              } else {
                nativeBinding = require("@itkyk/ftp-controller-win32-arm64-msvc");
              }
            } catch (e) {
              loadError = e;
            }
            break;
          default:
            throw new Error(`Unsupported architecture on Windows: ${arch}`);
        }
        break;
      case "darwin":
        localFileExisted = existsSync(join(__dirname, "ftp-controller.darwin-universal.node"));
        try {
          if (localFileExisted) {
            nativeBinding = require("./ftp-controller.darwin-universal.node");
          } else {
            nativeBinding = require("@itkyk/ftp-controller-darwin-universal");
          }
          break;
        } catch {
        }
        switch (arch) {
          case "x64":
            localFileExisted = existsSync(join(__dirname, "ftp-controller.darwin-x64.node"));
            try {
              if (localFileExisted) {
                nativeBinding = require("./ftp-controller.darwin-x64.node");
              } else {
                nativeBinding = require("@itkyk/ftp-controller-darwin-x64");
              }
            } catch (e) {
              loadError = e;
            }
            break;
          case "arm64":
            localFileExisted = existsSync(
              join(__dirname, "ftp-controller.darwin-arm64.node")
            );
            try {
              if (localFileExisted) {
                nativeBinding = require("./ftp-controller.darwin-arm64.node");
              } else {
                nativeBinding = require("@itkyk/ftp-controller-darwin-arm64");
              }
            } catch (e) {
              loadError = e;
            }
            break;
          default:
            throw new Error(`Unsupported architecture on macOS: ${arch}`);
        }
        break;
      case "freebsd":
        if (arch !== "x64") {
          throw new Error(`Unsupported architecture on FreeBSD: ${arch}`);
        }
        localFileExisted = existsSync(join(__dirname, "ftp-controller.freebsd-x64.node"));
        try {
          if (localFileExisted) {
            nativeBinding = require("./ftp-controller.freebsd-x64.node");
          } else {
            nativeBinding = require("@itkyk/ftp-controller-freebsd-x64");
          }
        } catch (e) {
          loadError = e;
        }
        break;
      case "linux":
        switch (arch) {
          case "x64":
            if (isMusl()) {
              localFileExisted = existsSync(
                join(__dirname, "ftp-controller.linux-x64-musl.node")
              );
              try {
                if (localFileExisted) {
                  nativeBinding = require("./ftp-controller.linux-x64-musl.node");
                } else {
                  nativeBinding = require("@itkyk/ftp-controller-linux-x64-musl");
                }
              } catch (e) {
                loadError = e;
              }
            } else {
              localFileExisted = existsSync(
                join(__dirname, "ftp-controller.linux-x64-gnu.node")
              );
              try {
                if (localFileExisted) {
                  nativeBinding = require("./ftp-controller.linux-x64-gnu.node");
                } else {
                  nativeBinding = require("@itkyk/ftp-controller-linux-x64-gnu");
                }
              } catch (e) {
                loadError = e;
              }
            }
            break;
          case "arm64":
            if (isMusl()) {
              localFileExisted = existsSync(
                join(__dirname, "ftp-controller.linux-arm64-musl.node")
              );
              try {
                if (localFileExisted) {
                  nativeBinding = require("./ftp-controller.linux-arm64-musl.node");
                } else {
                  nativeBinding = require("@itkyk/ftp-controller-linux-arm64-musl");
                }
              } catch (e) {
                loadError = e;
              }
            } else {
              localFileExisted = existsSync(
                join(__dirname, "ftp-controller.linux-arm64-gnu.node")
              );
              try {
                if (localFileExisted) {
                  nativeBinding = require("./ftp-controller.linux-arm64-gnu.node");
                } else {
                  nativeBinding = require("@itkyk/ftp-controller-linux-arm64-gnu");
                }
              } catch (e) {
                loadError = e;
              }
            }
            break;
          case "arm":
            localFileExisted = existsSync(
              join(__dirname, "ftp-controller.linux-arm-gnueabihf.node")
            );
            try {
              if (localFileExisted) {
                nativeBinding = require("./ftp-controller.linux-arm-gnueabihf.node");
              } else {
                nativeBinding = require("@itkyk/ftp-controller-linux-arm-gnueabihf");
              }
            } catch (e) {
              loadError = e;
            }
            break;
          case "riscv64":
            if (isMusl()) {
              localFileExisted = existsSync(
                join(__dirname, "ftp-controller.linux-riscv64-musl.node")
              );
              try {
                if (localFileExisted) {
                  nativeBinding = require("./ftp-controller.linux-riscv64-musl.node");
                } else {
                  nativeBinding = require("@itkyk/ftp-controller-linux-riscv64-musl");
                }
              } catch (e) {
                loadError = e;
              }
            } else {
              localFileExisted = existsSync(
                join(__dirname, "ftp-controller.linux-riscv64-gnu.node")
              );
              try {
                if (localFileExisted) {
                  nativeBinding = require("./ftp-controller.linux-riscv64-gnu.node");
                } else {
                  nativeBinding = require("@itkyk/ftp-controller-linux-riscv64-gnu");
                }
              } catch (e) {
                loadError = e;
              }
            }
            break;
          default:
            throw new Error(`Unsupported architecture on Linux: ${arch}`);
        }
        break;
      default:
        throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`);
    }
    if (!nativeBinding) {
      if (loadError) {
        throw loadError;
      }
      throw new Error(`Failed to load native binding`);
    }
    var { deploy: deploy2 } = nativeBinding;
    module2.exports.deploy = deploy2;
  }
});

// ts-src/cli/index.ts
var import_commander = require("commander");

// ts-src/deploy.ts
var import_lib = __toESM(require_lib());
var import_interpret = require("interpret");
var import_rechoir = __toESM(require("rechoir"));
var path = __toESM(require("path"));
var getConfig = async (configPath) => {
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
var upload = async (target, project) => {
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

// ts-src/createConfig.ts
var path2 = __toESM(require("path"));

// ts-src/core/config.template.ts
var templateConfig = `import { defineConfig } from "@itkyk/ftp-controller";

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
var config_template_default = templateConfig;

// ts-src/createConfig.ts
var import_fs = __toESM(require("fs"));
var createConfig = () => {
  const configPath = path2.resolve("./ftp.config.ts");
  import_fs.default.writeFileSync(configPath, config_template_default, "utf-8");
};

// ts-src/cli/index.ts
var program = new import_commander.Command();
program.option("-d, --deploy <value>", "input select stage.\n\u30C7\u30D7\u30ED\u30A4\u3059\u308B\u30BF\u30FC\u30B2\u30C3\u30C8\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002").option("-P, --project <value>", 'Specify the path to "ftp.config.ts".\nftp.config.ts\u30D5\u30A1\u30A4\u30EB\u307E\u3067\u306E\u30D1\u30B9\u3092\u6307\u5B9A\u3057\u307E\u3059\u3002', "./ftp.config.ts").option("-i, --init", "create template config file.\n\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E\u96DB\u5F62\u3092\u4F5C\u6210\u3057\u307E\u3059\u3002");
program.parse();
var opts = program.opts();
if (opts.deploy) {
  upload(opts.deploy, opts.project);
} else if (opts.init) {
  createConfig();
} else {
}
