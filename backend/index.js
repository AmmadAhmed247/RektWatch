import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import liquidationRoute from "./routes/liquidation.route.js"
import { startAllSocket } from "./controllers/allLiquidation.controller.js"
import { connectBitmex } from "./controllers/Bitmex.controller.js"

dotenv.config()
const app=express()
app.use(cors({origin:"http://localhost:5173",credentials:true}))


startAllSocket()
app.use("/api",liquidationRoute)



app.listen(3000)
