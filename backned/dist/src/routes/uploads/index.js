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
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const authMiddleWare_1 = require("../../middlewares/authMiddleWare");
const router = express_1.default.Router();
const s3Client = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
    region: process.env.AWS_DEFAULT_REGION,
});
router.get("/medical/certificate/download", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bucketName = "tu-sports-facility-dev";
    const fileName = "https://tu-sports-facility-dev.s3.ap-south-1.amazonaws.com/medical.pdf";
    const command = new client_s3_1.GetObjectCommand({
        Bucket: bucketName,
        Key: fileName,
    });
    try {
        const url = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 3600 });
        res.status(200).json({ url });
    }
    catch (error) {
        console.error('Error generating presigned URL:', error);
        res.status(500).json({ error: 'Failed to generate download link' });
    }
}));
router.post('/generate-presigned-url', authMiddleWare_1.authenticationMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { fileName, fileType } = req.body;
    //@ts-ignore
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(401).send({ message: "Unauthenticated" });
    }
    const allowedFileTypes = [
        "image/jpg", "image/jpeg", "image/png", "application/pdf"
    ];
    if (!allowedFileTypes.includes(fileType)) {
        res.status(404).send({ error: "Unsupported Image Type" });
    }
    try {
        const input = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            ContentType: fileType,
            Key: `/uploads/${userId}/documents/${fileName}-${Date.now()}`,
        };
        const putObjectCommand = new client_s3_1.PutObjectCommand(input);
        const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, putObjectCommand);
        res.status(200).json({ getSignedURL: signedUrl });
    }
    catch (error) {
        console.error("Error generating presigned URL:", error);
        res.status(500).json({ error: "Failed to generate presigned URL" });
    }
}));
exports.default = router;
