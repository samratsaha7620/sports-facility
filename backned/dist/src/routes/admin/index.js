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
const db_1 = __importDefault(require("../../db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "";
const router = express_1.default.Router();
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Ensure email and password are provided
    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
    }
    try {
        // Fetch the user from the database
        const user = yield db_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        //@ts-ignore
        if (user.type !== "ADMIN") {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        //@ts-ignore
        const isPasswordValid = password === user.password || "";
        if (!isPasswordValid) {
            res.status(403).json({ message: 'Invalid email or password.' });
            return;
        }
        // Generate JWT
        const token = jsonwebtoken_1.default.sign(
        //@ts-ignore
        { id: user.id, email: user.email, role: user.type }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({
            message: 'Login successful',
            user,
            token,
        });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
}));
exports.default = router;
