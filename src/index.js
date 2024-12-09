import 'dotenv/config'
import connectDB from "./db/index.js";
import { app } from './app.js';

connectDB() // connection called
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log("server is running on port " + process.env.PORT)
    })
})
.catch((err) => {
    console.log("mongo db connection faild: ", err)
})

/* this is 2nd-approch of connecting database by using try catch////// 1st-approch is in db.index.js file
import express from "express"
const app = express();
;( async () => {
   try {

    await mongoose.connect(`${process.env.MONGODB_RUI}/${DB_Name}`)
    app.on("error", (error) => {
        console.log("ERRR: ", error);
        throw error
    });

    app.listen(process.env.PORT, () => {
        console.log("App is listening of post"+ process.env.PORT);
    })

   } catch (error) {
    console.error("Error", error)
    throw err
   }
})()
*/