export default class Deck {
  cards = [];
  constructor(cards) {
    this.cards = Array.from(cards);
  }
}

Deck.prototype.draw = function(num = 1) {
  let removeNum = Math.floor(num);
  return this.cards.splice(0, removeNum);
}

// Durstenfeld shuffle
Deck.prototype.shuffle = function() {
  let shuffled = this.cards;
  for (let i = shuffled.length - 1; i >= 1; i--) {
    let randIndex = Math.floor((Math.random() * Date.now()) % (i + 1));
    // swap cards
    let temp = shuffled[i];
    shuffled[i] = shuffled[randIndex];
    shuffled[randIndex] = temp;
  }
}