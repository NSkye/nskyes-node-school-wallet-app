'use strict';

const fileTransactionsModel = require('./common/file-transactions-model');

class Transactions extends fileTransactionsModel {
  constructor() {
    super('transactions.json', 'cards.json');
  }
}

module.exports = Transactions;
