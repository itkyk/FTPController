"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Util {
}
Util.logGreen = (log) => {
    return `\u001b[32m${log}\u001b[0m`;
};
Util.logBlue = (log) => {
    return `\u001b[34m${log}\u001b[0m`;
};
Util.logRed = (log) => {
    return `\u001b[31m${log}\u001b[0m`;
};
exports.default = Util;
