export interface User {
  name: string;
  id: number;
  money: number;
  isAdmin: boolean;
}

export interface Bet {
  title: string;
  id: number;
  description?: string;
  closesAt: number; // Unix timestamp in milliseconds
  optionOne: BetOption;
  optionTwo: BetOption;
  isPending: boolean;
}

export interface BetOption {
  title: string;
  wagers: Wager[];
}

export interface Wager {
  userID: number;
  amountWagered: number;
}
