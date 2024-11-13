import { NextFunction, Request,Response } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export const authenticationMiddleWare = (req:AuthenticatedRequest,res:Response,next:NextFunction) =>{
  const token = req.headers.authorization?.split(' ')[1];
  if(!token){
     res.status(401).json({message:"Unauthorized"});
  }
  try{
    //@ts-ignore
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    
    //@ts-ignore
    req.user = { userId: decoded.userId };
    next();
  }catch(error){
     res.status(403).json({ message: "Forbidden" });
  }
}

