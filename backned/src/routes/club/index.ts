import express, { Request,Response } from "express";
import prisma from "../../db";
import { authenticationMiddleWare } from "../../middlewares/authMiddleWare";
import authorizeRole from "../../middlewares/authorizeRole";


const router = express.Router();


//FOR USERS
router.get('/:clubId/applicants',authenticationMiddleWare,authorizeRole("STUDENT"),async(req:Request,res:Response): Promise<void>=>{
  const {clubId} = req.params;

  
  //@ts-ignore
  const userId = req.user.userId;
  try{
    const clubWithApplications = await prisma.club.findUnique({
      where:{
        id:clubId
      },
      select:{
        id:true,
        name:true,
        applicationData:{
          select:{
            studentId:true,
          }
        }
      }
    })
    if (!clubWithApplications) {
       res.status(404).json({ error: 'Club not found' });
       return;
    }

    const applicantIds = clubWithApplications.applicationData.map(app => 
      app.studentId,
    );
    
    const isApplied = applicantIds.includes(userId);
    res.status(200).json({
      name: clubWithApplications.name,
      applicants: applicantIds,
      isApplied
    });
    return;
  } catch (error) {
    console.error('Error fetching club and applicants:', error);
    res.status(500).json({ error: 'Failed to fetch club and applicants' });
    return;
  }
})



//FOR ADMINS
router.patch('/club/:id/publish',async(req:Request , res:Response) =>{
  const {id} = req.params;
  const { publishStartDate, publishEndDate } = req.body;

  try {
    const updatedClub = await prisma.club.update({
      where: { id },
      data: {
        isApplicationPublished: true,
        publishStartDate: publishStartDate ? new Date(publishStartDate) : undefined,
        publishEndDate: publishEndDate ? new Date(publishEndDate) : undefined,
      },
    });
    res.status(200).json(updatedClub);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to publish club' });
  }
})



router.patch('/club/:clubId/unpublish', async (req: Request, res: Response) => {
  const { clubId } = req.params;

  try {
    await prisma.$transaction(async (prisma) => {
      // Update the club to unpublish the application form
      await prisma.club.update({
        where: { id: clubId },
        data: {
          isApplicationPublished: false,
          publishStartDate: null,
          publishEndDate: null,
        },
      });

      // Delete applications with PENDING, SUBMITTED, or REJECTED statuses for the club
      await prisma.applicationData.deleteMany({
        where: {
          clubId: clubId,
          stage: {
            in: ['PENDING', 'SUBMITTED', 'REJECTED'], // Match statuses to delete
          },
        },
      });
    });

    res.status(200).json({ message: 'Application form unpublished and applications deleted successfully.' });
    return;
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({ error: 'An error occurred. Please try again later.' });
    return;
  }
});



router.get("/details", async(req:Request,res:Response) =>{
  try{
    const clubs = await prisma.club.findMany({
      include:{
        applicationData:true,
      }
    })


    const response  = clubs.map((club) => ({
      id: club.id,
      name:club.name,
      isPublished:club.isApplicationPublished,
      publishEndDate : club.publishEndDate,
      applicationCount: club.applicationData.length,
    }))

    res.status(200).json(response)
  }catch(error){
    res.status(500).json({error:"Failed to fetch clubs"})
  }
})



router.get("/:clubId/applications",authenticationMiddleWare, authorizeRole("ADMIN") ,async(req:Request,res:Response) =>{
  const {clubId} = req.params;
  if (!clubId) {
    res.status(400).json({ error: "Club ID is required." });
    return;
  }

  try{
    const club = await prisma.club.findUnique({
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

    const applications = await prisma.applicationData.findMany({
      where:{
        clubId:clubId,
      },
      select:{
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
        isMembershipGranted:true,
        createdAt: true,
        updatedAt: true,
      },
    })

    const submittedApplications = applications.filter((app) => app.stage === "SUBMITTED");
    const acceptedApplications  = applications.filter((app) => app.stage === "ACCEPTED");
    const rejectedApplications  = applications.filter((app) => app.stage === "REJECTED");

    res.status(200).json({club,submittedApplications,acceptedApplications,rejectedApplications});
    return;
  }catch(error){
    res.status(500).json({error:"Failed to fetch applications"});
    return;
  }
})

router.post("/:clubId/applications/:applicationId/member/add",authenticationMiddleWare , authorizeRole("ADMIN"), async(req:Request,res:Response) => {
  const { clubId, applicationId } = req.params;
  const { validFrom, validTo } = req.body;

  if (!applicationId || !validFrom || !validTo) {
    res.status(400).json({ error: "Membership validFrom ,validTo dates and application id are required." });
    return;
  }
  try {
    await prisma.$transaction(async (tx) => {
      // Fetch the application to ensure it exists and is valid
      const application = await tx.applicationData.findUnique({
        where: { id: applicationId },
        select: {
          stage: true,
          clubId: true,
          studentId: true,
          isMembershipGranted:true,
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
      await tx.clubMembership.create({
        data: {
          clubId: application.clubId,
          userId: application.studentId,
          membershipStartDate: new Date(validFrom),
          membershipValidDate: new Date(validTo),
        },
      });

      // Update the application to mark the membership as granted
      await tx.applicationData.update({
        where: { id: applicationId },
        data: {
          isMembershipGranted: true,
        },
      });
    });

    res.status(200).json({ success: true, message: "Membership granted successfully!" })
    return;
  } catch (error) {
    console.error("Failed to grant membership:", error);
    res.status(500).json({ error: "Failed to grant membership" });
    return;
  }
})

router.get("/members", authenticationMiddleWare,authorizeRole("ADMIN") ,async (req: Request, res: Response) => {
  try {
    const clubsWithMembers = await prisma.club.findMany({
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
  } catch (error) {
    console.error("Error fetching club members:", error);
    res.status(500).json({ error: "Failed to fetch club members." });
  }
});


router.post("/:clubId/fees",authenticationMiddleWare,authorizeRole("ADMIN"),async(req:Request,res:Response) =>{
  const {clubId} = req.params;
  const {type, description, amount , dueDate,userId} = req.body;
  try{
    if(userId){
      const member = await prisma.clubMembership.findUnique({
        where:{
          id:userId,
        }
      })

      if(!member){
       res.status(404).json({ message: 'Member not found' });
       return;
      }
      await prisma.fee.create({
        data: {
          type,
          description,
          amount,
          dueDate: new Date(dueDate),
          membershipId: userId,
        },
      });
    }else{
      const members = await prisma.clubMembership.findMany({
        where:{clubId}
      })
      const feeData = members.map((member) =>({
        type,
        description,
        amount,
        dueDate: new Date(dueDate),
        membershipId: member.id
      }))
      await prisma.fee.createMany({ data: feeData });
    }
    res.status(200).json({ message: 'Fee added successfully' });
    return;
  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Error adding fee' });
    return;
  }
})

export default router;