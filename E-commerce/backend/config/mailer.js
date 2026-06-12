const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: options.to,
    subject: options.subject,
    html: options.html || `<p>${options.text}</p>`,
  });
};

module.exports = sendEmail;

// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// module.exports = transporter;