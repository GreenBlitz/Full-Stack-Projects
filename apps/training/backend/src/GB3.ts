//1
type GameState = "win" | "lose" | "draw";
//2
type Suit = "hearts" | "diamonds" | "clubs" | "spades";
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
  | "J"
  | "Q"
  | "K";
//4
interface Card {
  suit: Suit;
  rank: Rank;
}
//5
interface Flippable {
  isFaceUp: boolean;
}
//6
type FlippableCard = Flippable & Card;
//7
type OptionalCard = Card | undefined;
//8
type Deck = Card[] | FlippableCard[];

//9
function getCardName(card: Card): string {
  return card.rank + " of " + card.suit;
}
//10
function flipCard(flippableCard: FlippableCard): FlippableCard {
  flippableCard.isFaceUp = true;
  return flippableCard;
}
//11
function drawCard(deck: Deck): OptionalCard {
  if (deck.length === 0) return undefined;
  else return deck[0];
}
