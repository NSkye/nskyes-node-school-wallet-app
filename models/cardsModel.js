'use strict';

const fs = require('fs');
const path = require('path');

const luhn = require('../libs/luhn.js')
const ApplicationError = require('../libs/application-error')
const DATA_SOURCE = path.join(__dirname, '..', 'source/cards.json');

class Cards {
  constructor() {
    this.dataSource = require(DATA_SOURCE);
    this.cardIDs = this.dataSource.map((item) => item.id);
  }

  getCards () {
    return this.dataSource;
  }

  addCard (card) {
    const isValid = card
                    && card.hasOwnProperty('cardNumber')
                    && card.hasOwnProperty('balance')
                    && /^[0-9]+$/.test(card.cardNumber)
                    && luhn(card.cardNumber)
                    && /^[0-9]+$/.test(card.balance);

    if (isValid) {
      card.id = Math.max.apply(Math, this.cardIDs)+1;
      this.dataSource.push(card);
      this.saveUpdates();
      return card;
    } else {
      throw new ApplicationError("Card data is invalid", 400);
    }
  }

  deleteCard (id) {
    const card = this.dataSource.find((card) => card.id === id);

    if (typeof card === 'undefined') {
      throw new ApplicationError('Card not found', 404);
    } else {
      const index = this.dataSource.indexOf(card);
      this.dataSource.splice(index, 1);
      this.saveUpdates();
    }
  }

  saveUpdates() {
    fs.writeFileSync(DATA_SOURCE, JSON.stringify(this.dataSource, null, 4));
  }
}

module.exports = Cards;
