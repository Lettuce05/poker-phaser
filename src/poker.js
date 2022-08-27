export const isRoyalFlush = (cards) => {
  // check if all cards have the same suit
  let suit = cards[0].suit;
  if (!cards.every(card => card.suit === suit)) {
    return false;
  }
  // check for specific card ranks
  let cardRanks = cards.map(card => card.rank);
  if (!cardRanks.includes('A')) {
    return false;
  }
  if (!cardRanks.includes('K')) {
    return false;
  }
  if (!cardRanks.includes('Q')) {
    return false;
  }
  if (!cardRanks.includes('J')) {
    return false;
  }
  if (!cardRanks.includes('10')) {
    return false;
  }
  return true;
}