import mongoose from "mongoose";


const connectDB = async ()=> {
   try {
     const connectionInstance = await mongoose
     .connect(process.env.MONGODB_URL)
     console.log(`MongoDb Connected!! DB HOST:  ${connectionInstance.connection.host}`);
   } catch (error) {
       
    console.log("MongoDb connection Err::", error);
    process.exit(1)
}
}
export default connectDB

 
