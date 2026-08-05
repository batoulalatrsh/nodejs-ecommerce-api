const nodemailer = require("nodemailer");
// node mailer
const sendEmail = async (options) => {
  // 1) Create transporter(service that will send email like: "gmail","mailgun","mailtrap","sendGrid")
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure false port = 587, if true port=465
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define email option (like: from, to, subject, email cntent)
  const mailOption = {
    from: "E-shop App <batoulalatrsh76@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) send email
  await transporter.sendMail(mailOption);
};
module.exports = sendEmail;
