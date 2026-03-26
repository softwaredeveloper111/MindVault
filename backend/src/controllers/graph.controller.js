import itemModel from "../models/item.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { getGraphData ,  getRelatedItems } from "../services/graph.service.js";




export const getGraphDataController = asyncHandler(async(req,res)=>{
  
  const userId = req.user.id;
  const response = await getGraphData(userId)
  return res.status(200).json({
    success:true,
    message:"graph data",
    data:response
  })

})



export const getRelatedItemsController = asyncHandler( async(req,res)=>{
  
  const userId = req.user.id;
  const itemId = req.params.itemId;
  const response = await getRelatedItems(itemId,userId)
   if (!response) throw new AppError("item not found", 404);
  return res.status(200).json({
    success:true,
    message:"related items",
    data:response
  })

})