import esbuild from "esbuild";
import * as glob from "glob";
import path from "path";
import {nodeExternalsPlugin} from "esbuild-node-externals";

const srcTargets =    [
  path.resolve("./ts-src/index.ts"),
  path.resolve("./ts-src/cli/index.ts")
]

const libTargets =    [
  path.resolve("./lib/index.js")
]

const builder = async (targets: string[], outDir: string) => {
  const promises = [
    esbuild.build({
      entryPoints: targets,
      bundle: true,
      platform: "node",
      format: "esm",
      outExtension: {".js": ".mjs"},
      outdir: outDir,
      external: ["*.node"],
      plugins: [
        nodeExternalsPlugin()
      ]
    }),
    esbuild.build({
      entryPoints: targets,
      platform: "node",
      bundle: true,
      format: "cjs",
      outdir: outDir,
      loader: {".node": "empty"},
      outExtension: {".js": ".cjs"},
      external: ["*.node"],
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
    builder(libTargets, path.resolve("./lib")),
  ]);
}

init().then(() => {
  console.log("build complete")
})