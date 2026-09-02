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
interface Card {
  suit: Suit;
  rank: Rank;
}

//5
interface Flippable {
  isfaceup: boolean;
}

//6
type FlippableCard = Card & Flippable;

//7
type OptionalCard = Card | undefined;

//8
type Daek = Card[] | FlippableCard[];

//part 2

//1

const card1: Card = { suit: "hearts", rank: "7" };

function getCardName(card: Card) {
  console.log(card.rank, ", ", card.suit);
}

getCardName(card1);

//2

function flipCard(card: FlippableCard): FlippableCard {
  card.isfaceup = !card.isfaceup;
  return card;
}

//3

function drawCard(deck: Daek): Card | undefined {
  return deck.length > 0 ? deck[0] : undefined;
}

