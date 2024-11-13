import {z} from "zod";


export const registerSchema = z.object({
  name: z.string()
  .trim()
  .min(3, { message: "Username must be at least 3 characters long" }),

  email: z.string()
    .trim()
    .email("This is not a valid email.")
    .refine((val) => val.endsWith("@tezu.ac.in"), {
      message: "Email must end with @tezu.ac.in",
    }),

  phno: z.string()
  .trim()
  .regex(/^\+?[1-9]\d{1,14}$/,"Invalid phone number format"),

  password: z.string()
  .trim()
  .min(6, { message: "Password must be at least 6 characters long" }),
})


export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).optional(),
  username: z.string().email({ message: "Invalid username" }).optional(),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});