const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const message = {
    from: `Sports store - Tony4Men`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  const info = await transporter.sendMail(message);
  return info;
};

module.exports = sendMail;
