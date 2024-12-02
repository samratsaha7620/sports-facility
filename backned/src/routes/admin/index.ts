import express,{Request,Response} from "express";
import prisma from "../../db";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "";
const router = express.Router();


router.post("/login", async (req:Request,res:Response) =>{
  const { email, password } = req.body;
  // Ensure email and password are provided
  if (!email || !password) {
   res.status(400).json({ message: "Email and password are required" });
   return;
  }

  try {
    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    //@ts-ignore
    if (user.type !== "ADMIN") {
       res.status(403).json({ message: "Unauthorized" });
       return;
    }

    //@ts-ignore
    const isPasswordValid = password === user.password || "";
    if (!isPasswordValid) {
       res.status(403).json({ message: 'Invalid email or password.' });
       return;
    }

    // Generate JWT
    
    const token = jwt.sign(
      //@ts-ignore
      { id: user.id, email: user.email, role: user.type },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

     res.status(200).json({
      message: 'Login successful',
      user,
      token,
    });
    return;
  }catch(error){
     res.status(500).json( {message: "Internal Server Error"});
     return;
  }
})




export default router;