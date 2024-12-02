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
const client_1 = require("@prisma/client");
const authorizeRole_1 = __importDefault(require("../../middlewares/authorizeRole"));
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
router.get('/submitted', authMiddleWare_1.authenticationMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.user.userId;
    try {
        const submittedApplications = yield db_1.default.applicationData.findMany({
            where: {
                studentId: userId,
                stage: "SUBMITTED",
            },
            include: {
                club: {
                    select: {
                        name: true, // Select only the club name
                    },
                },
            },
        });
        const data = submittedApplications.map(application => ({
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
        console.error('Error fetching Submitted applications:', error);
        res.status(500).json({ error: 'Failed to retrieve Submitted applications' });
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
router.patch('/:applicationId/update', authMiddleWare_1.authenticationMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { applicationId } = req.params;
        const additionalData = req.body;
        const application = yield db_1.default.applicationData.findUnique({
            where: {
                id: applicationId
            },
        });
        if (!application) {
            res.status(404).json({ error: "Application not found" });
        }
        const updatedApplication = yield db_1.default.applicationData.update({
            where: {
                id: applicationId
            },
            data: {
                data: {
                    push: {
                        additionalData,
                    }
                },
                stage: client_1.ApplicationStatus.SUBMITTED,
            }
        });
        res.status(200).json({
            message: "Application data updated successfully",
            application: updatedApplication,
        });
    }
    catch (error) {
        console.error("Error updating application data:", error);
        res.status(500).json({ error: "Failed to update application data" });
    }
}));
router.patch("/accept/:applicationId", authMiddleWare_1.authenticationMiddleWare, (0, authorizeRole_1.default)("ADMIN"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { applicationId } = req.params;
    if (!applicationId) {
        res.status(400).json({ error: "Application Id is required." });
        return;
    }
    try {
        const updatedApplication = yield db_1.default.applicationData.update({
            where: {
                id: applicationId
            },
            data: {
                stage: "ACCEPTED",
            }
        });
        res.status(200).json({
            message: "Application accepted successfully.",
            application: updatedApplication,
        });
        return;
    }
    catch (error) {
        console.error("Error accepting application:", error);
        res.status(500).json({ error: "Failed to accept application." });
        return;
    }
}));
router.patch("/reject/:applicationId", authMiddleWare_1.authenticationMiddleWare, (0, authorizeRole_1.default)("ADMIN"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { applicationId } = req.params;
    if (!applicationId) {
        res.status(400).json({ error: "Application Id is required." });
        return;
    }
    try {
        const updatedApplication = yield db_1.default.applicationData.update({
            where: {
                id: applicationId
            },
            data: {
                stage: "REJECTED",
            }
        });
        res.status(200).json({
            message: "Application Rejected successfully.",
            application: updatedApplication,
        });
        return;
    }
    catch (error) {
        console.error("Error accepting application:", error);
        res.status(500).json({ error: "Failed to Reject application." });
        return;
    }
}));
exports.default = router;
