import {deploy} from "../lib/index";
import {FtpConfig} from "./core/defineConfig";
import * as path from "path";
import {register} from "esbuild-register/dist/node";

const getConfig = async(configPath: string) => {
  register();
    try {
      const {default: config} = require(path.resolve(configPath)) as {default: FtpConfig};
      return Promise.resolve(config);
    } catch (error: any) {
        return Promise.reject(error);
  }
}

const upload = async(target: string, project: string) => {
  try {
    const config = await getConfig(project);
    if (!config || !config[target]) throw new Error("Cannot find Config Data");
    const stageData = config[target];
    deploy(stageData.localRoot, stageData.remoteRoot, stageData.host, stageData.password, stageData.user, String(stageData.port || 21), stageData.deleteRemote || false);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

export {upload}