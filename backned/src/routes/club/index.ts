import express, { Request,Response } from "express";
import prisma from "../../db";
import { authenticationMiddleWare } from "../../middlewares/authMiddleWare";


const router = express.Router();

router.get('/:clubId/applicants',authenticationMiddleWare,async(req:Request,res:Response): Promise<void>=>{
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



router.patch('/club/:id/unpublish' , async(req:Request , res:Response) =>{
  const {id} = req.params;
  try{
    const updatedClub = await prisma.club.update({
      where:{id},
      data:{
        isApplicationPublished: false,
        publishStartDate: null,
        publishEndDate: null,
      }
    })
    res.status(200).json(updatedClub);
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to publish club' });
  }
})


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
      applicationCount: club.applicationData.length,
    }))

    res.status(200).json(response)
  }catch(error){
    res.status(500).json({error:"Failed to fetch clubs"})
  }
})

router.get("/:id/applications",async(req:Request,res:Response) =>{
  const {id} = req.params;
  try{
    const applications = await prisma.applicationData.findMany({
      where:{
        clubId:id,
      },
      include:{
        student:true,
      }
    })

    if(!applications.length){
     res.status(404).json({ message: 'No applications found for this club' });
    }

    res.status(200).json(applications);
  }catch(error){
    res.status(500).json({error:"Failed to fetch applications"});
  }
})


export default router;