import type { Bet, PublicUser } from "@repo/polyblitz-types";
import { BetCard } from "./BetCard";
import axios from "axios";
import { BackendURL } from "../../App";
import { useState } from "react";

interface BetProps {
  bets: Bet[];
  user: PublicUser | null;
}

type options = "optionOne" | "optionTwo";

async function BetOnAOption(
  user: PublicUser | null,
  betId: number,
  amountWagered: number,
  option: options,
) {
  if (user === null) {
    console.error("user not connected");
    return;
  }
  try {
    const response = await axios.post(
      `${BackendURL}/Bet/bets/${betId}/wagers`,
      {
        userID: user.id,
        amountWagered: amountWagered,
        option: option,
      },
    );
    console.log(response.data);
    alert("bet placed");
  } catch (error) {
    console.error("Could not add bet:", error);
  }
}

export function Bets({ bets, user }: BetProps) {
  const [optionOnePrice, setOptionOnePrice] = useState<number>(10);
  const [optionTwoPrice, setOptionTwoPrice] = useState<number>(10);
  return (
    <div>
      {bets.map((bet) => (
        <div key={bet.id}>
          <BetCard {...bet} />
          <button
            onClick={() =>
              BetOnAOption(user, bet.id, optionOnePrice, "optionOne")
            }
          >
            bet on {bet.optionOne.title} ${optionOnePrice}
          </button>
          <button
            onClick={() =>
              BetOnAOption(user, bet.id, optionTwoPrice, "optionTwo")
            }
          >
            bet on {bet.optionTwo.title} ${optionTwoPrice}
          </button>
        </div>
      ))}
    </div>
  );
}
