import asyncHandler from "../middleware/asyncHandler.js";
import userModel from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import redis from "../config/redis.js"





export const  registerController = asyncHandler(async (req, res) => {

  const { username, email, password } = req.body;

  const isAlreadyRegistered = await userModel.findOne({
    $or: [{ username }, { email }],
  })

  if(isAlreadyRegistered){
    throw new AppError("User already registered", 400);
  }

  const user = await userModel.create({ username, email, password });

  const token = jwt.sign({ id: user._id ,username:user.username }, process.env.JWT_SECRET_KEY, {  expiresIn:process.env.JWT_EXPIRES_IN});
  
  res.cookie('JWT_TOKEN',token)

  res.status(201).json({
    success:true,
    message:"user register sucessfully",
    data:user
  });
});





export const loginController = asyncHandler(async (req, res) => {
  

  const { identifier,  password } = req.body;

  const isUserRegistered = await userModel.findOne({
    $or:[
      { email : identifier },
      { username : identifier },
    ]
  }).select("+password")
  

  if(!isUserRegistered){
    throw new AppError("User not registered", 404);
  }

  
  const isPasswordMatch = await isUserRegistered.comparePassword(password);

  if(!isPasswordMatch){
    throw new AppError("Password not match", 401);
  }

  const token = jwt.sign({ id: isUserRegistered._id ,username:isUserRegistered.username }, process.env.JWT_SECRET_KEY, {  expiresIn:process.env.JWT_EXPIRES_IN});
 

  res.cookie("JWT_TOKEN", token )

  res.status(200).json({
    sucess:true,
    message:"user loggedin sucessfully",
    data:isUserRegistered
  })
  
})






export const getMeController = asyncHandler(async(req,res)=>{

 const userId = req.user.id;
 const user = await userModel.findById(userId);
 if(!user){
  throw new AppError("User not found", 404);
 }

 return res.status(200).json({
  success:true,
  message:"user profile fetch sucessfully",
  data:user
 })

})






export const logoutController  = asyncHandler(async(req,res)=>{

  const token = req.cookies?.JWT_TOKEN;

  if(token){
    
   await redis.set(token,Date.now().toString() ,"EX" , 60*60*24)

  }
  
  res.clearCookie("JWT_TOKEN");
  
  return res.status(200).json({
    success:true,
    message:"user logout sucessfully",
  })


})