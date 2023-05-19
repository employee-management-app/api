"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToDate = void 0;
const stringToDate = (stringDate, prefix = '-') => {
    if (!stringDate) {
        return null;
    }
    const [year, month, day] = stringDate
        .split(prefix)
        .reverse()
        .map((str, index) => index === 1 ? Number(str) - 1 : Number(str));
    return new Date(year, month, day);
};
exports.stringToDate = stringToDate;
