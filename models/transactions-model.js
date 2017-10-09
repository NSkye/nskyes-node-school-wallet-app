'use strict';

const fileTransactionsModel = require('./common/file-transactions-model');

class Transactions extends fileTransactionsModel {
  constructor(cardsSource) {
    super('transactions.json', cardsSource);
  }
}

module.exports = Transactions;
