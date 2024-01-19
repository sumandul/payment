const nodemailer = require("nodemailer");
const Mail = require("nodemailer/lib/mailer");

module.exports = async function sendEmail(receipt_email, url) {
  const transporter = nodemailer.createTransport({
    host: "mail.intukrom.org",
    port: process.env.MAILPORT,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.PASSWORD,
    },
  });

  const MailReponse = await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: receipt_email,
    subject: "Payment Receipt",
    text: "Payment Receipt",
    html: `<b><a href="${url}">${url}</a></b>`,
  });
  return MailReponse;
};
