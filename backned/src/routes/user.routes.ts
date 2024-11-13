import express , { Request,RequestHandler,Response } from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { registerSchema,loginSchema } from "../validators";
import { z ,ZodError} from "zod";
import prisma from "../db";
import { validateData } from "../middlewares/validationMiddleware";
import { generateTemporaryToken } from "../utils/generateToken";
import { sendEmail ,emailVerificationMailgenContent} from "../utils/mail";
import { authenticationMiddleWare } from "../middlewares/authMiddleWare";

const JWT_SECRET = process.env.JWT_SECRET || "";

const router = express.Router();


router.post('/register',validateData(registerSchema), async(req:Request , res:Response) :Promise<void>=>{
  try{
    const {name,email,phno,password} = req.body;
    const existingUser = await prisma.user.findUnique({
      where:{
        email:email,
      }
    })

    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password,12);

    const newUser = await prisma.user.create({
      data:{
        name:name,
        email: email,
        phno:phno,
        password:hashedPassword,
      }
    })
    const token = jwt.sign({userId:newUser.id},JWT_SECRET, {expiresIn:"1h"})
    res.status(201).json({newUser,
      token
    });
  }catch(error){
    if (error instanceof ZodError) {
       res.status(400).json({ errors: error.errors });
    }
    res.status(500).json( {message: "Internal Server Error"});
  }
  
});


router.post('/login', validateData(loginSchema) , async(req:Request , res:Response):Promise<void> =>{
  try{
    const {email , password} = req.body;

    const user  = await prisma.user.findUnique({
      where:{
        email:email,
      }
    })

    if(!user){
     res.status(400).json({message:"User Does Not Exist"});
     return;
    }

    const isPasswordValid  = await bcrypt.compare(password , user.password.toString());

    if(!isPasswordValid){
      res.status(400).json({message:"Invalid email or password"});
    }

    const token = jwt.sign({userId:user.id}, JWT_SECRET ,{expiresIn:"1h"});
    res.status(200).json({ message: 'Login successful',user,token});
  }catch(error){
    if (error instanceof ZodError) {
       res.status(400).json({ errors: error.errors });
    }
     res.status(500).json( {message: "Internal Server Error"});
  }
})

router.get('/current-user',authenticationMiddleWare as RequestHandler, async(req:Request,res:Response):Promise<void> =>{
  try{
    //@ts-ignore
    const userId = req.user?.userId;
    
    if(!userId){
       res.status(404).json({message:'User not Found'});
    }
    
    const currentUser = await prisma.user.findUnique({
      where:{
        id:userId, 
      }
    })
    if (!currentUser) {
       res.status(404).json({ message: 'User not found' });
    }

    res.json({
      ...currentUser,
    })
  }catch(error){
     res.status(500).json({ message: 'Internal server error' });
  }
})

// router.get('/verify-email/:token',async(req:Request , res:Response):Promise<void> =>{
//   try{
//     const { token } = req.params;
//     const users = await prisma.user.findMany({
//       where: { emailVerificationToken: { not: null } },
//   });

//   // Check each user for a matching token
//   const user = users.find(async (user) => {
//       const isValidToken = await bcrypt.compare(token, user.emailVerificationToken || "");
//       //@ts-ignore
//       return isValidToken && new Date() < user.emailVerificationExpiry;
//   });

//   if (!user) {
//      res.status(400).json({ message: 'Invalid or expired verification token' });
//      return;
//   }

//   // Update user's email verification status
//   await prisma.user.update({
//       where: { id: user.id },
//       data: {
//           emailVerified: true,
//           isEmailVerified: true,
//           emailVerificationToken: null,
//           emailVerificationExpiry: null,
//       },
//   });

//    res.status(200).json({ message: 'Email verified successfully' });
//    return;
//   }catch(error){
//    res.status(500).json({ message: "Server error" });
//    return;
//   }
// })

export default router;



































// router.route("/login").post(userLoginValidator(), validate, loginUser);
// router.route("/refresh-token").post(refreshAccessToken);
// router.route("/verify-email/:verificationToken").get(verifyEmail);

// router
//   .route("/forgot-password")
//   .post(userForgotPasswordValidator(), validate, forgotPasswordRequest);
// router
//   .route("/reset-password/:resetToken")
//   .post(
//     userResetForgottenPasswordValidator(),
//     validate,
//     resetForgottenPassword
//   );
//   router
//   .route("/change-password")
//   .post(
//     verifyJWT,
//     userChangeCurrentPasswordValidator(),
//     validate,
//     changeCurrentPassword
//   );
// router
//   .route("/resend-email-verification")
//   .post(verifyJWT, resendEmailVerification);





