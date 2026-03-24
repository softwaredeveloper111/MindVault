import asyncHandler from "../middleware/asyncHandler.js";
import userModel from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";




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










