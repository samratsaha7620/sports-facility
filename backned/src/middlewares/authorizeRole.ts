
import { Request,NextFunction, Response} from "express";


function authorizeRole(role:string){
  return (req:Request,res:Response,next :NextFunction) =>{
    //@ts-ignore
    const user = req.user;
    
  
    if(user?.role !== role){
      res.status(403).json({message:"Forbidden: Permission Denied"});
      return;
    }
    next();
  }
}


export default authorizeRole;