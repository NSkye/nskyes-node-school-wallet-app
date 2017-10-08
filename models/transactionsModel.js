'use strict';

const fileTransactionsModel = require('./common/fileTransactionsModel');

class Cards extends fileTransactionsModel {
  constructor() {
    super('transactions.json');
  }
}

module.exports = Transactions;
