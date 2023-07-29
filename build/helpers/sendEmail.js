"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
    },
    port: 90,
    service: 'gmail',
});
const getMailOptions = (options) => (Object.assign(Object.assign({}, options), { from: process.env.GMAIL_EMAIL }));
const sendEmail = (options) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(getMailOptions(options), (error, info) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(info);
            }
        });
    });
};
exports.sendEmail = sendEmail;
