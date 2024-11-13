import nodemailer from "nodemailer";

// Example sendEmail function using nodemailer
export const sendEmail = async ({ email, subject, mailgenContent }:any) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or another email service
    auth: {
      user: process.env.EMAIL_USER || "samrat7620@gmail.com",
      pass: process.env.EMAIL_PASS || "Samrat@416124",
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER || "samrat7620@gmail.com",
    to: email,
    subject: subject,
    html: mailgenContent,
  };

  await transporter.sendMail(mailOptions);
};

// Example mailgen content generator
export const emailVerificationMailgenContent = (username: string, url: string) => {
  return `<p>Hi ${username},</p><p>Please verify your email by clicking on the following link:</p><p><a href="${url}">Verify Email</a></p>`;
};
