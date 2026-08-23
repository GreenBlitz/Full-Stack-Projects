//1
type GameState = "win" | "lose" | "drew";

//2
type Suit = "hearts" | "diamonds" | "clubes" | "spades";

//3
type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "j"
  | "q"
  | "k";

//4
interface card {
  suit: Suit;
  rank: Rank;
}

//5
interface flippable {
  isfaceup: boolean;
}

//6
type FlippableCard = Card & Flippable;

//7
type OptionalCard = card | undefined;

//8
type Daek = card | flippable;

//part 2

//1

const card1: card = { suit: "hearts", rank: "7" };

function getCardName(card: card) {
  console.log(card.rank, ", ", card.suit);
}

getCardName(card1);

//2

const fl_card1: FlippableCard;
