interface optionsInterface {
    deploy: string,
    init: boolean;
    list: boolean;
}

interface uploadListInterface {
    name: string;
    uploaded: boolean;
    date: string;
}

import Util from "./Util";

const FtpDeploy = require("ftp-deploy");
const fs = require("fs");
const ftpDeploy = new FtpDeploy();
const readline = require("readline");



let bar = "";
let fileTotalCount = null;

const defaultOptions = {
    user: "",
    password: "",
    host: "",
    localRoot: `./dist/`,
    remoteRoot: "/htdocs/",
    include: ["*", "**/*"],
    deleteRemote: false,
    forcePasv: false
}

const getEnvData = (option: optionsInterface) => {
    return require("dotenv").config({path:`./ftp/.env.${option.deploy}`})
}

const transformObject = (option: optionsInterface) => {
    const result = getEnvData(option).parsed;
    const resultOptions = result;
    if (result.port) {
        resultOptions.port = Number(result.port);
    }
    if (result.include) {
        resultOptions.include = result.include.split(",");
    }
    if (result.exclude) {
        resultOptions.exclude = result.exclude.split(",");
    }
    if (result.deleteRemote) {
        resultOptions.deleteRemote = result.deleteRemote === "true" ? true : false;
    }
    if (result.forcePasv) {
        resultOptions.forcePasv = result.forcePasv === "true" ? true : false;
    }
    if (result.sftp) {
        resultOptions.sftp = result.sftp === "true" ? true : false;
    }

    const options = Object.assign(defaultOptions, resultOptions);
    return options
}

const createBar = (_fileUpdatedRate: number) => {
    bar = ""
    for(let k=0; k<=100; k+=10){
        if (k <= _fileUpdatedRate ) {
            bar += '\u001b[34m\u2588\u001b[0m'
        } else {
            bar += '\u001b[0m\u2588'
        }
    }
}

const pushLogFile = (data:uploadListInterface[]) => {
    let pushText = "";
    for (let i = 0; i < data.length; i++) {
      pushText = pushText + `Status: ${data[i].uploaded}, Date: ${data[i].date}, File: ${data[i].name}\n`;
    }
    fs.writeFileSync("./ftp/ftp-upload.log", pushText);
}

const deployData = (option: optionsInterface) => {
    const deployFileList:uploadListInterface[] = [];
    const ftpOptions = transformObject(option);
    console.log("\x1b[34m---------------------")
    console.log("!! Start Deploying !!")
    console.log("---------------------\x1b[0m")
    ftpDeploy.deploy(ftpOptions).then(()=> {
        if (option.list) {
            for (let i = 0; i < deployFileList.length; i++) {
                const status:string = deployFileList[i].uploaded? Util.logGreen("Success!"): Util.logRed("Failure!");
                const pushText = `filename: ${deployFileList[i].name}, Status: ${status}`
                console.log(pushText);
            }
        }
      pushLogFile(deployFileList);
        console.log("\n\x1b[32m---------------------")
        console.log("Completed file upload")
        console.log("---------------------\x1b[0m")
        process.exit(0);
    }).catch((err: any) => {
        console.log("\x1b[31m Error file upload\x1b[0\n", err)
    })
    ftpDeploy.on("uploading", (data: any) => {
        fileTotalCount = data.totalFilesCount + 1;
        const fileUpdatedRate = Math.trunc(data.transferredFileCount / fileTotalCount * 100);
        createBar(fileUpdatedRate)
        process.stdout.write('\x1B[?25l')
        if(data.transferredFileCount) {
            readline.clearLine(process.stdout);
            readline.cursorTo(process.stdout, 0);
        }
        process.stdout.write(`uploading(${fileUpdatedRate}%) ${bar} ${data.filename}`)
        process.stdout.write('\x1B[?25h')
          const date = new Date();
          deployFileList.push({name: data.filename, uploaded: true, date: `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`});
    })
    ftpDeploy.on("upload-error", (data: any) => {
          const date = new Date();
          deployFileList.push({name: data.filename, uploaded: false, date: `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`})
    })
}

const certification = (option: optionsInterface) => {
    const input = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const value = option.deploy.toUpperCase();
    input.question(`deployするには「${value}」を入力してください。`, (ans: string) => {
        if (ans === value) {
            deployData(option);
        } else {
            console.log("入力値が違います。\n再度実行してください。");
            process.exit(0);
        }
    })
}

export default certification;