import mongoose from "mongoose"





const collectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user should be required"],
    index:true,
  },

  name: {
    type: String,
    trim: true,
    required: [true, "name should be required"],
    maxlength: [50, "name cannot exceed 50 characters"],
  },
  
  description:{
    type:String,
    trim:true,
    default:"",
  },

  color:{
    type:String,
    enum: {
     values: ["red","blue","green","yellow","purple"],
      message: "Invalid color. Allowed values: red, blue, green, yellow, purple"
      },
    default:"blue"
  },
  
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
   

  },{timestamps:true})





const collectionModel = mongoose.model("Collection", collectionSchema)
export default collectionModel