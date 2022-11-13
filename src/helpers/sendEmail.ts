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
  transporter.sendMail(getMailOptions(options), (error, info) => {
    console.log(error || info);
  });
};
