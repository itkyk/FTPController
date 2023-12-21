export interface ServerConfig {
  host: string;
  user: string;
  password: string;
  localRoot: string,
  remoteRoot: string,
  deleteRemote?: boolean;
  port?: number;
}

export type FtpConfig = {[index: string]: ServerConfig};

const defineConfig = (config: FtpConfig) => {
  return config;
}

export {defineConfig};