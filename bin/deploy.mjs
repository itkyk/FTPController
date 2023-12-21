import { deploy } from "../lib/index";
import { jsVariants, extensions } from "interpret";
import rechoir from "rechoir";
import * as path from "path";
const getConfig = async (configPath) => {
  const ext = path.extname(configPath);
  const interpreted = Object.keys(jsVariants).find(
    (variant) => variant === ext
  );
  if (interpreted) {
    try {
      rechoir.prepare(extensions, configPath);
      const { default: config } = require(path.resolve(configPath));
      return Promise.resolve(config);
    } catch (error) {
      return Promise.reject(error);
    }
  }
};
const upload = async (target, project) => {
  try {
    const config = await getConfig(project);
    if (!config || !config[target])
      throw new Error("Cannot find Config Data");
    const stageData = config[target];
    deploy(stageData.localRoot, stageData.remoteRoot, stageData.host, stageData.password, stageData.user, String(stageData.port || 21), stageData.deleteRemote || false);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
export {
  upload
};
