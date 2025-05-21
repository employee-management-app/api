"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: 'ssl0.ovh.net',
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
    },
    port: 465,
    secure: true,
});
const getMailOptions = (options) => (Object.assign(Object.assign({}, options), { from: process.env.GMAIL_EMAIL }));
const sendEmail = (options) => {
    const footer = `
    <br/>
    <p>
      <img src="https://front-seven-eta.vercel.app/logo.png" alt="Logo" title="Logo" width="201" height="19" />
    </p>
    <p>ul. Ekspresowa 22<br/>52-130 Wrocław</p>
    <p style="font-size:10px;">Marka Technik w Terenie jest własnością firmy XEVA sp. z o.o. z siedzibą we Wrocławiu przy ul. Ekspresowej 22, zarejestrowanej w rejestrze przedsiębiorstw Krajowego Rejestru Sądowego prowadzonego w Sądzie Rejonowym dla Wrocławia-Fabrycznej, VI Wydział Gospodarczy pod numerem 0000698087, kapitał zakładowy 12 000,00 zł wpłacony w całości, której nadano Numer Identyfikacji Podatkowej NIP 8992829638.</p>
    <p style="font-size:10px;">Wiadomość ta oraz wszelkie załączone do niej pliki są poufne i mogą być prawnie chronione. Jeżeli nie jest Pan/Pani zamierzonym adresatem niniejszej wiadomości, nie może Pan/Pani jej ujawniać, kopiować, dystrybuować ani też w żaden inny sposób udostępniać lub wykorzystywać. O błędnym zaadresowaniu wiadomości prosimy niezwłocznie poinformować nadawcę i usunąć wiadomość.</p>
  `;
    return new Promise((resolve, reject) => {
        transporter.sendMail(getMailOptions(Object.assign(Object.assign({}, options), { html: `${options.html}${footer}` })), (error, info) => {
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
