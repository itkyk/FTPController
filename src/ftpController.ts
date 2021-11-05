const { Command } = require('commander');
const program = new Command();
program
    .option("-i, --init", "On/Off flag")
    .option("-d, --deploy [value]", "deploy value")
program.parse(process.argv);


const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();
const readline = require("readline");
const target = process.argv;
const init = require("./createEnv");
let bar = "";
let fileTotalCount = null

const defaultOptions = {
    user: "",
    password: "",
    host: "",
    localRoot: `../dist/`,
    remoteRoot: "/htdocs/",
    include: ["*", "**/*"],
    deleteRemote: false,
    forcePasv: false
}


const getEnvData = () => {
    return require("dotenv").config({path:`./ftp/.env.${opts.deploy}`})
}

const transformObject = () => {
    const result = getEnvData().parsed;
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


const deployData = () => {
    const ftpOptions = transformObject();
    console.log("\x1b[34m---------------------")
    console.log("!! Start Deploying !!")
    console.log("---------------------\x1b[0m")
    ftpDeploy.deploy(ftpOptions).then(()=> {
        console.log("\n\x1b[32m---------------------")
        console.log("Completed file upload")
        console.log("---------------------\x1b[0m")
    }).catch((err: any) => {
        console.log("\x1b[31m Error file upload\x1b[0\n", err)
    })
    ftpDeploy.on("uploading", (data: any) => {
        fileTotalCount = data.totalFilesCount + 1;
        const fileUpdatedRate = data.transferredFileCount / fileTotalCount * 100;
        createBar(fileUpdatedRate)
        process.stdout.write('\x1B[?25l')
        if(data.transferredFileCount) {
            readline.clearLine(process.stdout);
            readline.cursorTo(process.stdout, 0);
        }
        process.stdout.write(`uploading(${fileUpdatedRate}%) ${bar} ${data.filename}`)
        process.stdout.write('\x1B[?25h')
    })
}


const opts = program.opts();
if (opts.init === true) {
    init.default();
} else if (opts.deploy) {
    deployData();
}