'use strict';

const transactionsModel = require('../../models/transactions-model');

module.exports = async(ctx) => {
  const cardID = Number(ctx.params.id);
  ctx.body = await new transactionsModel().getTransactions(cardID);
};
