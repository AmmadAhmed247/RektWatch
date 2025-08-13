import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import BybitRoute from "./routes/bybit.route.js"
import { connectToBybit } from "./controllers/bybit.controller.js"
dotenv.config()
const app=express()
app.use(cors({origin:"http://localhost:5173",credentials:true}))


connectToBybit()
app.use("/api",BybitRoute)



app.listen(3000)
