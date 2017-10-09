'use strict';

const fileCardsModel = require('./common/file-cards-model');

class Cards extends fileCardsModel {
  constructor() {
    super('cards.json');
  }
}

module.exports = Cards;
