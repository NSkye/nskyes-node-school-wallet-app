'use strict';

const fileCardsModel = require('./common/fileCardsModel');

class Cards extends fileCardsModel {
  constructor() {
    super('cards.json');
    this.cardIDs = this.dataSource.map((item) => item.id);
  }
}

module.exports = Cards;
