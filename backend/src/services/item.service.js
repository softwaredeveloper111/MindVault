import itemModel  from "../models/item.model.js";
import collectionModel  from "../models/collection.model.js";
import highlightModel from "../models/highlight.model.js";
import { scrapeUrl } from "./scrapper.service.js";
import { addTaggingJob, addEmbeddingJob } from "../queues/item.queue.js";



/** create item */
export const createItem = async(userId,data)=>{

  const {url, sourceType , userNote, collectionIds} = data;
  const newItem= await itemModel.create({
     userId,
     url,
     sourceType,
     userNote,
     collectionIds: collectionIds || [],
     status: "processing",
  });
  
  if(sourceType !== "note" && url){

    const {title, description, thumbnailUrl, extractedText} = await scrapeUrl(url);

   
      let fallbackTitle = "";
    try {
      const parsed = new URL(url);
      const pathParts = parsed.pathname
        .split("/")
        .filter(Boolean)
        .at(-1)
        ?.replace(/[-_]/g, " ")
        ?? "";
      fallbackTitle = [parsed.hostname.replace("www.", ""), pathParts]
        .filter(Boolean)
        .join(" ");
    } catch (_) {
      fallbackTitle = url;
    }



    
    newItem.title        = title        || fallbackTitle;
    newItem.description  = description  || userNote || "";
    newItem.thumbnailUrl  = thumbnailUrl  || "";
    newItem.extractedText = extractedText || "";
    await newItem.save();

  };

 

  await addTaggingJob(newItem._id.toString(), newItem.title, newItem.description);
  await addEmbeddingJob(newItem._id.toString(), newItem.title, newItem.description);


  return newItem;

}








/** 2. GET ALL ITEMS — with filters + pagination  */ 

export const getItems = async(userId, query)=>{

 const {
  page=1,
  limit = 20,
  sourceType,
  tag,
  isFavourite,
  isArchived = false
 } = query;



 const filter = {userId, isArchived};
 if (sourceType) filter.sourceType = sourceType;
 if (tag) filter.tags = { $in: [tag] };
 if (isFavourite === "true") filter.isFavorite = true;

 const items = await itemModel.find(filter)
    .sort({ createdAt: -1 }) 
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .select("-embedding");

 
  const total = await itemModel.countDocuments(filter);

  return {
    items,
    total,
    page:Number(page),
    totalPages: Math.ceil(total / limit),
  };

}









/** GET SINGLE ITEM */
export const getItemById = async (itemId, userId) => {
  const item = await itemModel.findOne({ _id: itemId, userId });
  if (!item) return null;

  // lastViewedAt update karo — resurfacing ke liye
  item.lastViewedAt = Date.now();
  await item.save();

  return item;
};







/** UPDATE ITEM */
export const updateItem = async (itemId, userId, data) => {
  const item = await itemModel.findOneAndUpdate(
    { _id: itemId, userId }, 
    { $set: data },
    { new: true, runValidators: true }
  ).select("-embedding");

  if(!item) return null

  return item;
};









/** DELETE ITEM */
export const deleteItem = async (itemId, userId) => {
  const item = await itemModel.findOneAndDelete({ _id: itemId, userId });
  if (!item) return null;

  
  await collectionModel.updateMany(
    { items: itemId },
    { $pull: { items: itemId } }
  );

 
  await highlightModel.deleteMany({ itemId });
  return item;
};








/** RESURFACE ITEM */
export const getResurfacedItems = async (userId) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const items = await itemModel.find({
    userId,
    status: "ready",
    lastViewedAt: { $lt: thirtyDaysAgo },
  })
    .limit(5)
    .sort({ lastViewedAt: 1 }) // sabse purana pehle
    .select("-embedding");

  return items;
};