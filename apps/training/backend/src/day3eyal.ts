type Gamestate = "Win" | "lose" | "draw";
type Suit = "hearts" | "diamonds" | "spades" | "clubs";
type rank = "A" | "K" | "Q" | "J" | "10" | "9" | "8"| "7" | "6" | "5"| "4" | "3" | "2";
interface Card {suit: Suit, rank: rank};
interface Flipable {isFaceUp: boolean};
type FlippableCard = Card & Flipable;
type OptianalCard = Card | "undefined"
type Deck = Card[] | FlippableCard[]




function getCardName(card: Card):string {
    return card.rank+" of "+card.suit
}
const KH : Card = {suit: "hearts",rank: "K"}
console.log(getCardName(KH));

function flipcard(card: FlippableCard):FlippableCard{
    const tr = card
    if (tr.isFaceUp){
        tr.isFaceUp = false;
        return(tr);
    }
    else{
        tr.isFaceUp = true
        return(tr)
    }
}
const sixSf: FlippableCard = {suit:"spades", rank:"6", isFaceUp:false}
const newTempCard = flipcard(sixSf)
console.log(newTempCard)

function drawCard(deck: Deck): OptianalCard{
    if(deck.length>0){
        const tr: OptianalCard = {suit:deck[0].suit, rank:deck[0].rank}
        return tr;
    }
    else{
        const tr: OptianalCard = "undefined"
        return tr;
    }
}
const AD: Card = {suit:"diamonds", rank:"A"}
const deckk : Deck = [KH,AD]
console.log(drawCard(deckk))    



