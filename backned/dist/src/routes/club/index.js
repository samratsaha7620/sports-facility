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
const authorizeRole_1 = __importDefault(require("../../middlewares/authorizeRole"));
const router = express_1.default.Router();
//FOR USERS
router.get('/:clubId/applicants', authMiddleWare_1.authenticationMiddleWare, (0, authorizeRole_1.default)("STUDENT"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
//FOR ADMINS
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
router.patch('/club/:clubId/unpublish', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clubId } = req.params;
    try {
        yield db_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            // Update the club to unpublish the application form
            yield prisma.club.update({
                where: { id: clubId },
                data: {
                    isApplicationPublished: false,
                    publishStartDate: null,
                    publishEndDate: null,
                },
            });
            // Delete applications with PENDING, SUBMITTED, or REJECTED statuses for the club
            yield prisma.applicationData.deleteMany({
                where: {
                    clubId: clubId,
                    stage: {
                        in: ['PENDING', 'SUBMITTED', 'REJECTED'], // Match statuses to delete
                    },
                },
            });
        }));
        res.status(200).json({ message: 'Application form unpublished and applications deleted successfully.' });
        return;
    }
    catch (error) {
        console.error('Transaction error:', error);
        res.status(500).json({ error: 'An error occurred. Please try again later.' });
        return;
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
            publishEndDate: club.publishEndDate,
            applicationCount: club.applicationData.length,
        }));
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch clubs" });
    }
}));
router.get("/:clubId/applications", authMiddleWare_1.authenticationMiddleWare, (0, authorizeRole_1.default)("ADMIN"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clubId } = req.params;
    if (!clubId) {
        res.status(400).json({ error: "Club ID is required." });
        return;
    }
    try {
        const club = yield db_1.default.club.findUnique({
            where: { id: clubId },
            select: {
                id: true,
                name: true,
                isApplicationPublished: true,
                publishStartDate: true,
                publishEndDate: true,
            },
        });
        if (!club) {
            res.status(404).json({ error: "Club not found." });
            return;
        }
        const applications = yield db_1.default.applicationData.findMany({
            where: {
                clubId: clubId,
            },
            select: {
                id: true,
                studentId: true,
                student: {
                    select: {
                        name: true,
                        email: true,
                        phno: true,
                    },
                },
                data: true,
                stage: true,
                isMembershipGranted: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        const submittedApplications = applications.filter((app) => app.stage === "SUBMITTED");
        const acceptedApplications = applications.filter((app) => app.stage === "ACCEPTED");
        const rejectedApplications = applications.filter((app) => app.stage === "REJECTED");
        res.status(200).json({ club, submittedApplications, acceptedApplications, rejectedApplications });
        return;
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch applications" });
        return;
    }
}));
router.post("/:clubId/applications/:applicationId/member/add", authMiddleWare_1.authenticationMiddleWare, (0, authorizeRole_1.default)("ADMIN"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clubId, applicationId } = req.params;
    const { validFrom, validTo } = req.body;
    if (!applicationId || !validFrom || !validTo) {
        res.status(400).json({ error: "Membership validFrom ,validTo dates and application id are required." });
        return;
    }
    try {
        yield db_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Fetch the application to ensure it exists and is valid
            const application = yield tx.applicationData.findUnique({
                where: { id: applicationId },
                select: {
                    stage: true,
                    clubId: true,
                    studentId: true,
                    isMembershipGranted: true,
                },
            });
            if (!application || application.clubId !== clubId || application.stage !== "ACCEPTED") {
                res.status(404).json({ error: "Invalid application or application not in 'ACCEPTED' stage." });
                return;
            }
            if (application.isMembershipGranted) {
                throw new Error("Membership already granted");
            }
            // Add the member to the club
            yield tx.clubMembership.create({
                data: {
                    clubId: application.clubId,
                    userId: application.studentId,
                    membershipStartDate: new Date(validFrom),
                    membershipValidDate: new Date(validTo),
                },
            });
            // Update the application to mark the membership as granted
            yield tx.applicationData.update({
                where: { id: applicationId },
                data: {
                    isMembershipGranted: true,
                },
            });
        }));
        res.status(200).json({ success: true, message: "Membership granted successfully!" });
        return;
    }
    catch (error) {
        console.error("Failed to grant membership:", error);
        res.status(500).json({ error: "Failed to grant membership" });
        return;
    }
}));
router.get("/members", authMiddleWare_1.authenticationMiddleWare, (0, authorizeRole_1.default)("ADMIN"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clubsWithMembers = yield db_1.default.club.findMany({
            select: {
                id: true,
                name: true,
                memberships: {
                    select: {
                        id: true,
                        userId: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phno: true,
                            },
                        },
                        membershipStartDate: true,
                        membershipValidDate: true,
                        status: true,
                        fees: {
                            select: {
                                id: true,
                                type: true,
                                description: true,
                                amount: true,
                                dueDate: true,
                                status: true,
                            },
                        },
                    },
                },
            },
        });
        res.status(200).json(clubsWithMembers);
    }
    catch (error) {
        console.error("Error fetching club members:", error);
        res.status(500).json({ error: "Failed to fetch club members." });
    }
}));
router.post("/:clubId/fees", authMiddleWare_1.authenticationMiddleWare, (0, authorizeRole_1.default)("ADMIN"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clubId } = req.params;
    const { type, description, amount, dueDate, userId } = req.body;
    try {
        if (userId) {
            const member = yield db_1.default.clubMembership.findUnique({
                where: {
                    id: userId,
                }
            });
            if (!member) {
                res.status(404).json({ message: 'Member not found' });
                return;
            }
            yield db_1.default.fee.create({
                data: {
                    type,
                    description,
                    amount,
                    dueDate: new Date(dueDate),
                    membershipId: userId,
                },
            });
        }
        else {
            const members = yield db_1.default.clubMembership.findMany({
                where: { clubId }
            });
            const feeData = members.map((member) => ({
                type,
                description,
                amount,
                dueDate: new Date(dueDate),
                membershipId: member.id
            }));
            yield db_1.default.fee.createMany({ data: feeData });
        }
        res.status(200).json({ message: 'Fee added successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding fee' });
        return;
    }
}));
exports.default = router;
