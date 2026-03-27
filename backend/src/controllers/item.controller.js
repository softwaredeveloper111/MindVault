import itemModel from "../models/item.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import AppError from "../utils/AppError.js";
import {createItem , getItems , getResurfacedItems ,getItemById , updateItem ,deleteItem } from "../services/item.service.js";
import  highlightModel  from "../models/highlight.model.js";






export const saveItemController = asyncHandler(async (req, res) => {
  
  const userId = req.user.id
  
  // const {url, sourceType, userNote, collectionIds} = req.body;
  // console.log(req.body);
   
  const item =  await createItem(userId , req.body)
  return res.status(201).json({
    success:true , 
    message:"item saved successfully", 
    data:item})
  
})






export const fetchItemController = asyncHandler(async(req,res)=>{
 
  const userId = req.user.id;
  const data = req.query;
  // console.log(data)

  const  items = await getItems(userId,data);
  return res.status(200).json({
    success:true,
    message:"items fetch sucessfully",
    data:items
  })
})





export const resurfacedController = asyncHandler(async (req,res)=> {
  
 const userId = req.user.id;
 const items = await getResurfacedItems(userId);
 res.status(200).json({
  success:true,
  message:"item fetch before 30days sucessfully",
  data:items
 })

})







export const getSingleItemController = asyncHandler(async(req,res)=>{

  const userId = req.user.id;
  const itemId = req.params.id;

   
  const item = await getItemById(itemId,userId);
  if(!item){
    throw new AppError("item not found" , 404)
  }
  res.status(200).json({
    success:true,
    message:"item fetch sucessfully",
    data:item
  })
  

})






export const updateItemController = asyncHandler(async(req,res)=>{

 const userId = req.user.id;
  const itemId = req.params.id;
  const data = req.body;

  
  const item = await updateItem(itemId,userId,data);

  if(!item){
    throw new AppError("item not found" ,404)
  }

  res.status(200).json({
    success:true,
    message:"item updated sucessfully",
    data:item
  })

})






export const deleteItemController = asyncHandler(async(req,res)=>{

  const userId = req.user.id;
  const itemId = req.params.id;

  const item = await deleteItem(itemId,userId);
   if(!item){
    throw new AppError("item not found")
   }



  res.status(200).json({
    success:true,
    message:"item deleted sucessfully"
  })


})






export const addHighlightController = asyncHandler(async(req,res)=>{

const userId = req.user.id;
const itemId = req.params.id;
const {text,color} = req.body;

 const isItemExists = await itemModel.findById(itemId);
  if(!isItemExists){
    throw new AppError("item not found", 404)
  } 


  const isOwnerOfItem = isItemExists.userId.toString() === userId.toString();
  if(!isOwnerOfItem){
    throw new AppError("you are not owner of this item", 401)
  }



  const highlight = await highlightModel.create({itemId,userId,text,color});

  res.status(200).json({
    success:true,
    message:"highlight added sucessfully",
    data:highlight
  })

})