import express,{ Request,Response } from "express";
import {  PutObjectCommand,GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { authenticationMiddleWare } from "../../middlewares/authMiddleWare";


const router  = express.Router();

const s3Client = new S3Client({
  credentials:{
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  region:process.env.AWS_DEFAULT_REGION,
})

router.get("/medical/certificate/download" , async(req:Request, res:Response) =>{
  const bucketName = "tu-sports-facility-dev";
  const fileName =  "https://tu-sports-facility-dev.s3.ap-south-1.amazonaws.com/medical.pdf";

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  })

  try{
    const url = await getSignedUrl(s3Client,command , {expiresIn:3600});
    res.status(200).json({url});
  }catch(error){
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ error: 'Failed to generate download link' });
  }
})


router.post('/generate-presigned-url', authenticationMiddleWare , async (req:Request,res:Response)=>{
  const {fileName ,fileType} = req.body;
  //@ts-ignore
  const userId = req.user?.userId
  if(!userId){
     res.status(401).send({message:"Unauthenticated"})
  }
  const allowedFileTypes = [
    "image/jpg","image/jpeg","image/png","application/pdf"
  ];

  if(!allowedFileTypes.includes(fileType as string)){
     res.status(404).send({error:"Unsupported Image Type"})
  }
  try{
    const input = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      ContentType: fileType as string,
      Key: `/uploads/${userId}/documents/${fileName}-${Date.now()}` as string,
    }
    const putObjectCommand = new PutObjectCommand(input);
    const signedUrl = await getSignedUrl(s3Client,putObjectCommand);
     res.status(200).json({ getSignedURL: signedUrl });
  }catch(error){
    console.error("Error generating presigned URL:", error);
     res.status(500).json({ error: "Failed to generate presigned URL" });
  }
})



export default router;