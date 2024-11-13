"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailVerificationMailgenContent = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Example sendEmail function using nodemailer
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, subject, mailgenContent }) {
    const transporter = nodemailer_1.default.createTransport({
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
    yield transporter.sendMail(mailOptions);
});
exports.sendEmail = sendEmail;
// Example mailgen content generator
const emailVerificationMailgenContent = (username, url) => {
    return `<p>Hi ${username},</p><p>Please verify your email by clicking on the following link:</p><p><a href="${url}">Verify Email</a></p>`;
};
exports.emailVerificationMailgenContent = emailVerificationMailgenContent;
