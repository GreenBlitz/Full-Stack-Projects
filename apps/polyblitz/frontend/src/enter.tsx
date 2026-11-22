import { useState } from "react";
import { useEffect } from "react";
import type { Bet } from "@repo/polyblitz-types";
import axios from "axios";
const [bets, setbets] = useState<Bet[] | null>(null)
async function enter(){
const respone= await axios.get <Bet>("http://localhost:3000/bets")
    console.log(respone.data);
    useEffect(()=>{
        setbets?.
    })

 
    

}
