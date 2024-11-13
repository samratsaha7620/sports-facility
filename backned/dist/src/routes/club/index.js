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
router.get('/:clubId/applicants', authMiddleWare_1.authenticationMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clubId } = req.params;
    //@ts-ignore
    const userId = req.user.userId;
    try {
        const clubWithApplications = yield db_1.default.club.findUnique({
            where: {
                id: clubId
            },
            select: {
                id: true,
                name: true,
                applicationData: {
                    select: {
                        studentId: true,
                    }
                }
            }
        });
        if (!clubWithApplications) {
            res.status(404).json({ error: 'Club not found' });
            return;
        }
        const applicantIds = clubWithApplications.applicationData.map(app => app.studentId);
        const isApplied = applicantIds.includes(userId);
        res.status(200).json({
            name: clubWithApplications.name,
            applicants: applicantIds,
            isApplied
        });
        return;
    }
    catch (error) {
        console.error('Error fetching club and applicants:', error);
        res.status(500).json({ error: 'Failed to fetch club and applicants' });
        return;
    }
}));
router.patch('/club/:id/publish', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { publishStartDate, publishEndDate } = req.body;
    try {
        const updatedClub = yield db_1.default.club.update({
            where: { id },
            data: {
                isApplicationPublished: true,
                publishStartDate: publishStartDate ? new Date(publishStartDate) : undefined,
                publishEndDate: publishEndDate ? new Date(publishEndDate) : undefined,
            },
        });
        res.status(200).json(updatedClub);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to publish club' });
    }
}));
router.patch('/club/:id/unpublish', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updatedClub = yield db_1.default.club.update({
            where: { id },
            data: {
                isApplicationPublished: false,
                publishStartDate: null,
                publishEndDate: null,
            }
        });
        res.status(200).json(updatedClub);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to publish club' });
    }
}));
router.get("/details", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clubs = yield db_1.default.club.findMany({
            include: {
                applicationData: true,
            }
        });
        const response = clubs.map((club) => ({
            id: club.id,
            name: club.name,
            isPublished: club.isApplicationPublished,
            applicationCount: club.applicationData.length,
        }));
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch clubs" });
    }
}));
router.get("/:id/applications", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const applications = yield db_1.default.applicationData.findMany({
            where: {
                clubId: id,
            },
            include: {
                student: true,
            }
        });
        if (!applications.length) {
            res.status(404).json({ message: 'No applications found for this club' });
        }
        res.status(200).json(applications);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch applications" });
    }
}));
exports.default = router;
