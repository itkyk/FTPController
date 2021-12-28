class Util {
    static logGreen = (log: string):string => {
        return `\u001b[32m${log}\u001b[0m`;
    }

    static logBlue = (log:string):string => {
        return `\u001b[34m${log}\u001b[0m`;
    }

    static logRed = (log:string):string => {
        return `\u001b[31m${log}\u001b[0m`;
    }
}

export default Util;