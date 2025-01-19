//////////////////////////////////////////////////////////////////////////////////////////////
class CreditCard {
  constructor(theName, the4DigitID, theHolder) {
    this.theName = theName;
    this.the4DigitID = the4DigitID;
    this.theHolder = theHolder;
  }
  static getName(fourDigitID) {
    for (const card of CreditCard.allCards) { 
      if (card.the4DigitID === fourDigitID) {
        return card.theName;}
    }
    return "UNKNOWN"; // Return null if no match is found
  }
  static getHolder(fourDigitID) {
    for (const card of CreditCard.allCards) { 
      if (card.the4DigitID === fourDigitID) {
        return card.theHolder;}
    }
    return "UNKNOWN"; // Return null if no match is found
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////