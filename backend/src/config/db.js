import mongoose from "mongoose";




async function connectToDB(){

 try {
     await mongoose.connect(process.env.MONGO_URI);
     console.log("Connected to MongoDB dababase.");
 } catch (error) {
     console.log('mongodb connection problem ❌',error.message);
 }
}




export default connectToDB;