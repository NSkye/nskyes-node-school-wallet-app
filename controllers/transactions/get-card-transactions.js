'use strict';

const transactionsModel = require('../../models/transactions-model');
const cardsModel = require('../../models/cards-model');

module.exports = async(ctx) => {
  const cardID = Number(ctx.params.id);
  const cards = await new cardsModel().getItems();
  ctx.body = await new transactionsModel(cards).getTransactions(cardID);
};
