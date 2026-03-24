import itemModel from "../models/item.model.js";


export const getGraphData = async (userId) => {

  const items = await itemModel
    .find({ userId, status: "ready" })
    .select("_id title sourceType tags topicCluster thumbnailUrl");

  
  const nodes = items.map((item) => ({
    id: item._id.toString(),
    title: item.title,
    sourceType: item.sourceType,
    topicCluster: item.topicCluster,
    thumbnailUrl: item.thumbnailUrl,
    tags: item.tags,
  }));



  
  const edges = [];
  const addedEdges = new Set(); 

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const itemA = items[i];
      const itemB = items[j];

    
      const commonTags = itemA.tags.filter((tag) =>
        itemB.tags.includes(tag)
      );

      if (commonTags.length > 0) {
       
        const edgeKey = [itemA._id.toString(), itemB._id.toString()]
          .sort()
          .join("-");

        if (!addedEdges.has(edgeKey)) {
          addedEdges.add(edgeKey);
          edges.push({
            source: itemA._id.toString(),
            target: itemB._id.toString(),
            commonTags, 
          });
        }
      }
    }
  }

  return { nodes, edges };
};



export const getRelatedItems = async (itemId, userId) => {

  
  const item = await itemModel
    .findOne({ _id: itemId, userId })
    .select("tags topicCluster");

  if (!item || item.tags.length === 0) return [];

 
  const relatedItems = await itemModel
    .find({
      userId,
      status: "ready",
      _id: { $ne: itemId },      
      tags: { $in: item.tags },  
    })
    .limit(6)
    .select("-embedding -extractedText");

  return relatedItems;
};