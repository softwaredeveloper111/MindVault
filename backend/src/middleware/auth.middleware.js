import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import redis from "../config/redis.js";





async function identifyingUser(req,res,next){
  const token = req.cookies?.JWT_TOKEN;
  if(!token){
     throw new AppError("token not found" ,401);
  }

  const blackListToken =await redis.get(token);
  if(blackListToken){
    throw new AppError("token is blacklisted" ,401);
  }

  try {
     
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
    
  } catch (error) {
     
    console.log(error.message)
    throw new AppError("invalid token" ,401);
  }
}



export default identifyingUser