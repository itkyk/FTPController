"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const createEnv = () => {
    if (!fs.existsSync(`./ftp`)) {
        fs.mkdirSync(`./ftp`);
    }
};
const templateEnvFile = () => {
    const envFile = `user=""
password=""
host=""
localRoot=""
remoteRoot=""
include="*,**/*"
deleteRemote=true
forcePasv=true
    `;
    fs.writeFile("./ftp/.env.template", envFile, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("create template env file");
        }
    });
};
const init = () => {
    createEnv();
    templateEnvFile();
};
exports.default = init;
