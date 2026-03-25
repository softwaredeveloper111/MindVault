import itemModel from "../models/item.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import AppError from "../utils/AppError.js";
import {semanticSearch} from "../services/search.service.js"
import mongoose from "mongoose"



export const searchController = asyncHandler(async(req,res)=>{
  const {q} = req.query
  const userId = req.user.id
  const items = await semanticSearch(userId,q);
  return res.status(200).json({
    success:true,
    message:"search result",
    data:items
  })

})





export const getTagsController = asyncHandler(async(req,res)=>{

 const userId = req.user.id
  const tags = await itemModel.aggregate([
     { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {$unwind:"$tags"},
    {$group:{_id:"$tags",count:{$sum:1}}},
    {$sort:{count:-1}}
  ])


  return res.status(200).json({
    success:true,
    message:"tags",
    data:tags
  })

})




export const getClustersController = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const clusters = await itemModel.aggregate([
    { $match: { 
        userId: new mongoose.Types.ObjectId(userId),
        topicCluster: { $exists: true, $ne: null } // sirf jinke paas cluster hai
    }},
    { $group: { _id: "$topicCluster", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  return res.status(200).json({
    success: true,
    message: "clusters",
    data: clusters
  });
});
