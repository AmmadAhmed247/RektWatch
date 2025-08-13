import express from "express"
import { getLiquidations } from "../controllers/bybit.controller.js"

const router=express.Router()


router.get('/bybit',async(req,res)=>{
    const limit=parseInt(req.query.limit) || 100
    const data=getLiquidations().slice(-limit)
    res.json(data)
})



export default router