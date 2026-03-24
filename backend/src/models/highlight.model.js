import mongoose from "mongoose";




const highlightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user should be required"],
  },

  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: [true, "item should be required"],
  },

  text: {
    type: String,
    trim: true,
    required: [true, "text should be required"],
  },

  color: {
    type: String,
    enum: ["red", "blue", "green", "yellow", "purple"],
    default:"green",
   
  },

},{timestamps:true});
  


const highlightModel = mongoose.model("Highlight", highlightSchema);
export default highlightModel;
