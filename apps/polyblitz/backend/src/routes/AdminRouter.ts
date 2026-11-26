import { Router } from "express";
import { BetSchema, BetOptionSchema, WagerSchema } from "@repo/polyblitz-types";
import { StatusCodes } from "http-status-codes";

export const AdminRouter: Router = Router();

AdminRouter.post("/admin/bets/:id/resolve", async (req, res)=>{
  const option = BetOptionSchema.safeParse(req.body);
  if(!option.success){
    res.status(StatusCodes.BAD_REQUEST).json({message: "Type wasn't a BetOptionSchema"})
  }
  try{
    
  } 
  catch(e){
  }
});