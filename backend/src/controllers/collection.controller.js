import itemModel from "../models/item.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import AppError from "../utils/AppError.js";
import collectionModel from "../models/collection.model.js"





export const createFolderController = asyncHandler(async(req,res)=>{

const userId = req.user.id;
const {name,description, color} = req.body;
const createFolder = await collectionModel.create({userId,name,description,color})
res.status(201).json({
  success:true,
  message:"folder create sucessfully",
  data:createFolder
})

})







export const showAllFolderController = asyncHandler(async(req,res)=>{
  
  const userId = req.user.id;
  const collections = await collectionModel.find({userId});
  res.status(200).json({
    success:true,
    message:"user's all folder fetch sucessfully",
    count:collections.length,
    data:collections
  })

})





export const getAllItemsController = asyncHandler( async (req,res)=>{
 
  const userId = req.user.id;
  const collectionId = req.params.id;
  const allItems = await  collectionModel.findOne( {_id:collectionId,userId}).populate("items");

  if(!allItems ){
    throw new AppError("collection not found", 404)
  }

  return res.status(200).json({
    success:true,
    message:"all items fetch successfully of the folder",
    data:allItems
  })

})





export const updateCollectionController = asyncHandler( async(req,res)=>{

/**
 * name,
 * description
 * color,
 */

const userId = req.user.id;
const collectionId = req.params.id;

const updatedFolder = await collectionModel.findOneAndUpdate({userId , _id:collectionId}, req.body ,{new:true});
if(!updatedFolder){
  throw new AppError("collection not found" , 404)
}

return res.status(200).json({
  success:true,
  message:"folder update sucessfully",
  data:updatedFolder
})


})






export const deleteCollectionController = asyncHandler(async(req,res)=>{

  const userId = req.user.id
  const collectionId = req.params.id;
  const response =  await collectionModel.findOneAndDelete({userId,_id:collectionId});
  if(!response){
    throw new AppError("collection not found" ,404)
  }
 
  await itemModel.updateMany(
  { collectionIds: collectionId },
  { $pull: { collectionIds: collectionId } }
);

  return res.status(200).json({
    success:true,
    message:"collection deleted sucessfully"
  })

})







export const pushItemsinCollectionController = asyncHandler(async(req,res) =>{

  const userId = req.user.id;
  const collectionId = req.params.id;

  const itemId = req.body.itemId;

  const collection = await collectionModel.findOneAndUpdate(
    {_id:collectionId,
      userId,
    },
    {
      $addToSet:{items:itemId}
    },
    {new:true}
  );

  if(!collection){
    throw new AppError("collection not found or item already push or item not belong to the user" , 404)
  }

  await itemModel.findByIdAndUpdate(itemId , {$addToSet: { collectionIds: collectionId }})

  return res.status(201).json({
    success:true,
    message:"item add in a folder sucessfully",
    data: collection
  })


})








export const pullItemCollectionController = asyncHandler(async(req,res) => {

  const userId = req.user.id;
  const collectionId = req.params.id;
  const itemId = req.params.itemId;


  const updateCollection = await collectionModel.findOneAndUpdate(
    {_id:collectionId,
      userId,
      items: itemId,
    },
    {
      $pull:{items:itemId}
    },
    {new:true}
  );

  if(!updateCollection){
    throw new AppError("collection not found or items does not belongs to the user", 404)
  }

  await itemModel.findByIdAndUpdate(itemId, {
  $pull: { collectionIds: collectionId }
});

  return res.status(200).json({
    success:true,
    message:"item remove sucessfully",
    data:updateCollection
  })



})