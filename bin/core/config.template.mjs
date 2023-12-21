const templateConfig = `import { defineConfig } from "@itkyk/ftp-controller";

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
export {
  config_template_default as default
};
