import express , { Request,RequestHandler,Response } from "express";
import jwt from "jsonwebtoken";



const router = express.Router();



router.get("/",(req: Request, res: Response) =>{
  const authHeader = req.headers.authorization;

  if (!authHeader) {
     res.status(401).json({ message: "Unauthorized: No token provided" });
     return;
  }
  const token = authHeader.split(" ")[1]; // Extract Bearer token
  if (!token) {
     res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!); // Verify token
    res.status(200).json(decoded); // Return user data from the token payload
  } catch (error) {
    res.status(403).json({ message: "Forbidden: Invalid or expired token" });
  }
})

export default router;