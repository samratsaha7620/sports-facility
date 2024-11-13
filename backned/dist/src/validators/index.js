"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string()
        .trim()
        .min(3, { message: "Username must be at least 3 characters long" }),
    email: zod_1.z.string()
        .trim()
        .email("This is not a valid email.")
        .refine((val) => val.endsWith("@tezu.ac.in"), {
        message: "Email must end with @tezu.ac.in",
    }),
    phno: zod_1.z.string()
        .trim()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
    password: zod_1.z.string()
        .trim()
        .min(6, { message: "Password must be at least 6 characters long" }),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email address" }).optional(),
    username: zod_1.z.string().email({ message: "Invalid username" }).optional(),
    password: zod_1.z.string().min(6, { message: "Password must be at least 6 characters long" }),
});
