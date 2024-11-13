import express,{Request,Response} from "express";
import prisma from "../../db";
import { authenticationMiddleWare } from "../../middlewares/authMiddleWare";

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
  console.log(clubId,userId,data);
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

export default router;