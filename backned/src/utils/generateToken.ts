import crypto from "crypto"
import bcrypt from "bcrypt"


export const generateTemporaryToken  = () =>{
  const unHashedToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = bcrypt.hashSync(unHashedToken,10);
  const tokenExpiry  = new Date(Date.now()+ 1000 * 60 *15);
  return {unHashedToken, hashedToken , tokenExpiry};
}