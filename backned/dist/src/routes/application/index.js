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
const authMiddleWare_1 = require("../../middlewares/authMiddleWare");
const router = express_1.default.Router();
router.get("/availableClubs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const applications = yield db_1.default.club.findMany({
            where: {
                isApplicationPublished: true,
                publishEndDate: {
                    gt: now,
                }
            },
            select: {
                id: true,
                name: true,
                description: true,
                isApplicationPublished: true,
                publishStartDate: true,
                publishEndDate: true,
            },
        });
        res.status(200).json(applications);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch available applications" });
    }
}));
router.post("/add/:clubId", authMiddleWare_1.authenticationMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clubId } = req.params;
    //@ts-ignore
    const userId = req.user.userId;
    //@ts-ignore
    const { data } = req.body;
    console.log(clubId, userId, data);
    try {
        const indexedEntries = Object.keys(data)
            .filter((key) => !isNaN(Number(key)))
            .map((key) => data[key]);
        const namedEntries = Object.keys(data)
            .filter((key) => isNaN(Number(key)))
            .reduce((acc, key) => (Object.assign(Object.assign({}, acc), { [key]: data[key] })), {});
        const prismaDataArray = [namedEntries, ...indexedEntries];
        const application = yield db_1.default.applicationData.create({
            data: {
                studentId: userId,
                clubId: clubId,
                data: prismaDataArray,
                stage: "PENDING",
            }
        });
        res.status(201).json({ message: 'Application submitted successfully', application });
    }
    catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ error: 'Failed to submit application' });
    }
}));
router.get('/pending', authMiddleWare_1.authenticationMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.user.userId;
    try {
        const pendingApplications = yield db_1.default.applicationData.findMany({
            where: {
                studentId: userId,
                stage: "PENDING",
            },
            include: {
                club: {
                    select: {
                        name: true, // Select only the club name
                    },
                },
            },
        });
        const data = pendingApplications.map(application => ({
            id: application.id,
            studentId: application.studentId,
            clubId: application.clubId,
            data: application.data,
            stage: application.stage,
            createdAt: application.createdAt,
            updatedAt: application.updatedAt,
            clubName: application.club.name, // Add club name here
        }));
        res.status(200).json(data);
    }
    catch (error) {
        console.error('Error fetching pending applications:', error);
        res.status(500).json({ error: 'Failed to retrieve pending applications' });
    }
}));
router.get('/:applicationId', authMiddleWare_1.authenticationMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { applicationId } = req.params;
    try {
        const data = yield db_1.default.applicationData.findUnique({
            where: {
                id: applicationId,
            },
            select: {
                data: true,
                id: true,
            }
        });
        res.status(200).send(data);
    }
    catch (error) {
        console.error('Error fetching pending applications:', error);
        res.status(500).json({ error: 'Failed to retrieve pending applications' });
    }
}));
exports.default = router;
