import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

const transporter = nodemailer.createTransport({
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
  port: 90,
  service: 'gmail',
});

const getMailOptions = (options: Mail.Options) => ({
  ...options,
  from: process.env.GMAIL_EMAIL,
});

export const sendEmail = (options: Mail.Options) => {
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
    transporter.sendMail(getMailOptions({ ...options, html: `${options.html}${footer}` }), (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};
