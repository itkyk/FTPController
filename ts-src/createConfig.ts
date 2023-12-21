import * as path from "path";
import templateConfig from "./core/config.template";
import fs from "fs";

const createConfig = () => {
  const configPath = path.resolve("./ftp.config.ts");
  fs.writeFileSync(configPath, templateConfig, "utf-8");
};

export {createConfig};