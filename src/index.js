// require('dotenv').config({path:'./env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path:'./env'
})

connectDB()


//------------First approach---------------

/*import mongoose from "mongoose";
import { DB_NAME } from "./constant";

import express from "express";
const app = express()



;( async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on("Error", (error) => {console.log("ERRR: ", error);
        throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App Listening on port ${process.env.PORT}`);
            
        })
    }
    catch(error){
        console.error("ERROR: " , error)
        throw err
    }
})()*/