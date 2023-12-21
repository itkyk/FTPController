import esbuild from "esbuild";
import * as glob from "glob";
import path from "path";
import {nodeExternalsPlugin} from "esbuild-node-externals";
import * as fs from "fs";

const srcTargets =    glob.sync(path.resolve("./ts-src/**/*"), {
  nodir: true,
  ignore: [path.resolve("./ts-src/**/*.d.ts")]
});

const builder = async (targets: string[], outDir: string) => {
  const promises = [
    esbuild.build({
      entryPoints: targets,
      bundle: false,
      platform: "node",
      format: "esm",
      outExtension: {".js": ".mjs"},
      outdir: outDir,
      loader: {".node": "binary"},
      plugins: [
        nodeExternalsPlugin()
      ]
    }),
    esbuild.build({
      entryPoints: targets,
      platform: "node",
      bundle: false,
      format: "cjs",
      outdir: outDir,
      loader: {".node": "empty"},
      plugins: [
        nodeExternalsPlugin()
      ]
    })
  ];
  await Promise.all(promises);
}

const init = async() => {
  await Promise.all([
    builder(srcTargets, path.resolve("./bin")),
  ]);
}

init().then(() => {
  console.log("build complete")
})