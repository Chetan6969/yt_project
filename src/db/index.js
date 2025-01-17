import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try {
        const connectionInstant = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n Mongo DB connected !! DB HOST : ${connectionInstant.connection.host}`);
        
    } catch (error) {
        console.log("MongoDB Connection FAILED : ",error);
        process.exit(1)   
    }
}

export default connectDB 