import express,{Request,Response} from "express";
import prisma from "../../db";
import { authenticationMiddleWare } from "../../middlewares/authMiddleWare";
import { ApplicationStatus } from "@prisma/client";
import authorizeRole from "../../middlewares/authorizeRole";


const router = express.Router();

router.get("/availableClubs",async (req:Request,res:Response)=>{
  try{
    const now = new Date();

    const applications = await prisma.club.findMany({
      where:{
        isApplicationPublished:true,
        publishEndDate:{
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
    })

    res.status(200).json(applications)
  }catch(error){
    res.status(500).json({error:"Failed to fetch available applications"});
  }
})


router.post("/add/:clubId", authenticationMiddleWare, async(req:Request,res:Response)=>{
  const {clubId} = req.params;
  //@ts-ignore
  const userId = req.user.userId;
  //@ts-ignore
  const {data} = req.body
 
  try{
    const indexedEntries = Object.keys(data)
    .filter((key) => !isNaN(Number(key)))
    .map((key) => data[key]);

    const namedEntries = Object.keys(data)
      .filter((key) => isNaN(Number(key)))
      .reduce((acc, key) => ({ ...acc, [key]: data[key] }), {});

    const prismaDataArray = [namedEntries, ...indexedEntries];
    const application = await prisma.applicationData.create({
      data:{
        studentId:userId,
        clubId: clubId,
        data:prismaDataArray,
        stage:"PENDING",
      }
    })
    res.status(201).json({ message: 'Application submitted successfully', application });
  }catch(error){
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
})


router.get('/pending',authenticationMiddleWare,async(req:Request,res:Response) =>{
  //@ts-ignore
  const userId = req.user.userId;

  try{
    const pendingApplications = await prisma.applicationData.findMany({
      where:{
        studentId:userId,
        stage:"PENDING",
      },
      include: {
        club: { // Include the related club data
          select: {
            name: true, // Select only the club name
          },
        },
      },
    })
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
  }catch(error){
    console.error('Error fetching pending applications:', error);
    res.status(500).json({ error: 'Failed to retrieve pending applications' });
  }
})

router.get('/submitted',authenticationMiddleWare,async(req:Request,res:Response) =>{
  //@ts-ignore
  const userId = req.user.userId;

  try{
    const submittedApplications = await prisma.applicationData.findMany({
      where:{
        studentId:userId,
        stage:"SUBMITTED",
      },
      include: {
        club: { // Include the related club data
          select: {
            name: true, // Select only the club name
          },
        },
      },
    })
    
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
  }catch(error){
    console.error('Error fetching Submitted applications:', error);
    res.status(500).json({ error: 'Failed to retrieve Submitted applications' });
  }
})


router.get('/:applicationId',authenticationMiddleWare,async(req:Request,res:Response)=>{
  const {applicationId} =req.params;
  try{
    const data = await prisma.applicationData.findUnique({
      where:{
        id:applicationId,
      },
      select:{
        data:true,
        id:true,
      }
    })
    res.status(200).send(data);
  }catch(error){
    console.error('Error fetching pending applications:', error);
    res.status(500).json({ error: 'Failed to retrieve pending applications' });
  }
})

router.patch('/:applicationId/update',authenticationMiddleWare,async(req:Request,res:Response)=>{
  try{
    const {applicationId} = req.params;
    const additionalData = req.body;

    const application = await prisma.applicationData.findUnique({
      where:{
        id: applicationId
      },
    })

    if(!application){
      res.status(404).json({error:"Application not found"})
    }

    const updatedApplication = await prisma.applicationData.update({
      where:{
        id:applicationId
      },
      data:{
        data:{
          push:{
            additionalData ,
          }
        },
        stage: ApplicationStatus.SUBMITTED,
      }
    })

    res.status(200).json({
      message:"Application data updated successfully",
      application: updatedApplication,
    })
  }catch(error){
    console.error("Error updating application data:", error);
    res.status(500).json({ error: "Failed to update application data" });
  }
})

router.patch("/accept/:applicationId", authenticationMiddleWare, authorizeRole("ADMIN") , async(req:Request,res:Response) =>{
  const {applicationId} = req.params;
  if(!applicationId){
    res.status(400).json({ error: "Application Id is required." });
    return;
  }
  try{
    const updatedApplication = await prisma.applicationData.update({
      where:{
        id: applicationId
      },
      data:{
        stage:"ACCEPTED",
      }
    })

    res.status(200).json({
      message: "Application accepted successfully.",
      application: updatedApplication,
    })
    return;

  }catch(error){
    console.error("Error accepting application:", error);
    res.status(500).json({ error: "Failed to accept application." });
    return;
  }
})

router.patch("/reject/:applicationId", authenticationMiddleWare, authorizeRole("ADMIN") , async(req:Request,res:Response) =>{
  const {applicationId} = req.params;
  if(!applicationId){
    res.status(400).json({ error: "Application Id is required." });
    return;
  }
  try{
    const updatedApplication = await prisma.applicationData.update({
      where:{
        id: applicationId
      },
      data:{
        stage:"REJECTED",
      }
    })

    res.status(200).json({
      message: "Application Rejected successfully.",
      application: updatedApplication,
    })
    return;

  }catch(error){
    console.error("Error accepting application:", error);
    res.status(500).json({ error: "Failed to Reject application." });
    return;
  }
})


export default router;