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
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validators_1 = require("../validators");
const zod_1 = require("zod");
const db_1 = __importDefault(require("../db"));
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const authMiddleWare_1 = require("../middlewares/authMiddleWare");
const JWT_SECRET = process.env.JWT_SECRET || "";
const router = express_1.default.Router();
router.post('/register', (0, validationMiddleware_1.validateData)(validators_1.registerSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phno, password } = req.body;
        const existingUser = yield db_1.default.user.findUnique({
            where: {
                email: email,
            }
        });
        if (existingUser) {
            res.status(400).json({ message: "Email already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 12);
        const newUser = yield db_1.default.user.create({
            data: {
                name: name,
                email: email,
                phno: phno,
                password: hashedPassword,
            }
        });
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ newUser,
            token
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.post('/login', (0, validationMiddleware_1.validateData)(validators_1.loginSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield db_1.default.user.findUnique({
            where: {
                email: email,
            }
        });
        if (!user) {
            res.status(400).json({ message: "User Does Not Exist" });
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password.toString());
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: 'Login successful', user, token });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.get('/current-user', authMiddleWare_1.authenticationMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        //@ts-ignore
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(404).json({ message: 'User not Found' });
        }
        const currentUser = yield db_1.default.user.findUnique({
            where: {
                id: userId,
            }
        });
        if (!currentUser) {
            res.status(404).json({ message: 'User not found' });
        }
        res.json(Object.assign({}, currentUser));
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// router.get('/verify-email/:token',async(req:Request , res:Response):Promise<void> =>{
//   try{
//     const { token } = req.params;
//     const users = await prisma.user.findMany({
//       where: { emailVerificationToken: { not: null } },
//   });
//   // Check each user for a matching token
//   const user = users.find(async (user) => {
//       const isValidToken = await bcrypt.compare(token, user.emailVerificationToken || "");
//       //@ts-ignore
//       return isValidToken && new Date() < user.emailVerificationExpiry;
//   });
//   if (!user) {
//      res.status(400).json({ message: 'Invalid or expired verification token' });
//      return;
//   }
//   // Update user's email verification status
//   await prisma.user.update({
//       where: { id: user.id },
//       data: {
//           emailVerified: true,
//           isEmailVerified: true,
//           emailVerificationToken: null,
//           emailVerificationExpiry: null,
//       },
//   });
//    res.status(200).json({ message: 'Email verified successfully' });
//    return;
//   }catch(error){
//    res.status(500).json({ message: "Server error" });
//    return;
//   }
// })
exports.default = router;
// router.route("/login").post(userLoginValidator(), validate, loginUser);
// router.route("/refresh-token").post(refreshAccessToken);
// router.route("/verify-email/:verificationToken").get(verifyEmail);
// router
//   .route("/forgot-password")
//   .post(userForgotPasswordValidator(), validate, forgotPasswordRequest);
// router
//   .route("/reset-password/:resetToken")
//   .post(
//     userResetForgottenPasswordValidator(),
//     validate,
//     resetForgottenPassword
//   );
//   router
//   .route("/change-password")
//   .post(
//     verifyJWT,
//     userChangeCurrentPasswordValidator(),
//     validate,
//     changeCurrentPassword
//   );
// router
//   .route("/resend-email-verification")
//   .post(verifyJWT, resendEmailVerification);
