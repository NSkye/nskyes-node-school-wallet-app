'use strict';

const fileTransactionsModel = require('./common/fileTransactionsModel');

class Cards extends fileTransactionsModel {
  constructor() {
    super('cards.json');
  }
}

module.exports = Transactions;
