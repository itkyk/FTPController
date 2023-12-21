export interface ServerConfig {
    host: string;
    user: string;
    password: string;
    localRoot: string;
    remoteRoot: string;
    deleteRemote?: boolean;
    port?: number;
}
export type FtpConfig = {
    [index: string]: ServerConfig;
};
declare const defineConfig: (config: FtpConfig) => FtpConfig;
export { defineConfig };
