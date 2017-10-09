'use strict';

const transactionsModel = require('../../models/transactions-model');

module.exports = async(ctx) => {
  ctx.body = await new transactionsModel().getItems();
};
