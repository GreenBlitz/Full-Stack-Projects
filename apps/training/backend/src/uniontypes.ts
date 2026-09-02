type GameState = "win" | "lose" | "draw";
type Suit = "heart" | "diamonds" | "clubs" | "spades";
type Rank =
  | "A"
  | "1"
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
interface Card {
  suit: Suit;
  rank: Rank;
}
interface Flippable {
  isFaceUp: boolean;
}
type FlippableCard = Card & Flippable;
type OptionalCard = Card | undefined;
type Deck = Card[] | FlippableCard[];

function getCardName(card: Card): string {
  return card.rank + card.suit;
}

function flipCard(flippableCard: FlippableCard): FlippableCard {
  return {
    suit: flippableCard.suit,
    rank: flippableCard.rank,
    isFaceUp: !flippableCard.isFaceUp,
  };
}

function drawCard(deck: Deck): OptionalCard {
  return deck.shift();
}
