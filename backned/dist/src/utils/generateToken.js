"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTemporaryToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateTemporaryToken = () => {
    const unHashedToken = crypto_1.default.randomBytes(32).toString("hex");
    const hashedToken = bcrypt_1.default.hashSync(unHashedToken, 10);
    const tokenExpiry = new Date(Date.now() + 1000 * 60 * 15);
    return { unHashedToken, hashedToken, tokenExpiry };
};
exports.generateTemporaryToken = generateTemporaryToken;
