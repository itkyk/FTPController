var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// lib/index.js
var require_lib = __commonJS({
  "lib/index.js"(exports, module) {
    var { existsSync, readFileSync } = __require("fs");
    var { join } = __require("path");
    var { platform, arch } = process;
    var nativeBinding = null;
    var localFileExisted = false;
    var loadError = null;
    function isMusl() {
      if (!process.report || typeof process.report.getReport !== "function") {
        try {
          const lddPath = __require("child_process").execSync("which ldd").toString().trim();
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
                nativeBinding = __require("./ftp-controller.android-arm64.node");
              } else {
                nativeBinding = __require("@itkyk/ftp-controller-android-arm64");
              }
            } catch (e) {
              loadError = e;
            }
            break;
          case "arm":
            localFileExisted = existsSync(join(__dirname, "ftp-controller.android-arm-eabi.node"));
            try {
              if (localFileExisted) {
                nativeBinding = __require("./ftp-controller.android-arm-eabi.node");
              } else {
                nativeBinding = __require("@itkyk/ftp-controller-android-arm-eabi");
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
                nativeBinding = __require("./ftp-controller.win32-x64-msvc.node");
              } else {
                nativeBinding = __require("@itkyk/ftp-controller-win32-x64-msvc");
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
                nativeBinding = __require("./ftp-controller.win32-ia32-msvc.node");
              } else {
                nativeBinding = __require("@itkyk/ftp-controller-win32-ia32-msvc");
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
                nativeBinding = __require("./ftp-controller.win32-arm64-msvc.node");
              } else {
                nativeBinding = __require("@itkyk/ftp-controller-win32-arm64-msvc");
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
            nativeBinding = __require("./ftp-controller.darwin-universal.node");
          } else {
            nativeBinding = __require("@itkyk/ftp-controller-darwin-universal");
          }
          break;
        } catch {
        }
        switch (arch) {
          case "x64":
            localFileExisted = existsSync(join(__dirname, "ftp-controller.darwin-x64.node"));
            try {
              if (localFileExisted) {
                nativeBinding = __require("./ftp-controller.darwin-x64.node");
              } else {
                nativeBinding = __require("@itkyk/ftp-controller-darwin-x64");
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
                nativeBinding = __require("./ftp-controller.darwin-arm64.node");
              } else {
                nativeBinding = __require("@itkyk/ftp-controller-darwin-arm64");
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
            nativeBinding = __require("./ftp-controller.freebsd-x64.node");
          } else {
            nativeBinding = __require("@itkyk/ftp-controller-freebsd-x64");
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
                  nativeBinding = __require("./ftp-controller.linux-x64-musl.node");
                } else {
                  nativeBinding = __require("@itkyk/ftp-controller-linux-x64-musl");
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
                  nativeBinding = __require("./ftp-controller.linux-x64-gnu.node");
                } else {
                  nativeBinding = __require("@itkyk/ftp-controller-linux-x64-gnu");
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
                  nativeBinding = __require("./ftp-controller.linux-arm64-musl.node");
                } else {
                  nativeBinding = __require("@itkyk/ftp-controller-linux-arm64-musl");
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
                  nativeBinding = __require("./ftp-controller.linux-arm64-gnu.node");
                } else {
                  nativeBinding = __require("@itkyk/ftp-controller-linux-arm64-gnu");
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
                nativeBinding = __require("./ftp-controller.linux-arm-gnueabihf.node");
              } else {
                nativeBinding = __require("@itkyk/ftp-controller-linux-arm-gnueabihf");
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
                  nativeBinding = __require("./ftp-controller.linux-riscv64-musl.node");
                } else {
                  nativeBinding = __require("@itkyk/ftp-controller-linux-riscv64-musl");
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
                  nativeBinding = __require("./ftp-controller.linux-riscv64-gnu.node");
                } else {
                  nativeBinding = __require("@itkyk/ftp-controller-linux-riscv64-gnu");
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
    var { deploy } = nativeBinding;
    module.exports.deploy = deploy;
  }
});
export default require_lib();
