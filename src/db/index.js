import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

// 1st-approch to connect database with atlas
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
        console.log(`\n MongoDB connected !! DB HOST; ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("DB connection FAILD: ", error);
        process.exit(1)
    }
}

export default connectDB // call it into index.js file in src