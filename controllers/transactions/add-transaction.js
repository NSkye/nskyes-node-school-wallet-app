'use strict';

const transactionsModel = require('../../models/transactions-model');
const cardsModel = require('../../models/cards-model');

module.exports = async(ctx) => {
  const transaction = JSON.parse(JSON.stringify(ctx.request.body));
  console.log(typeof transaction);
  const cardID = Number(ctx.params.id);
  const cards = await new cardsModel.getItems();
  try {
    ctx.body = await new transactionsModel(cards).addTransaction(transaction, cardID);
  } catch (e) {
    if (e.status) {
      ctx.status = e.status;
      ctx.body = e.message;
    }
    else {
      ctx.status = 500;
      ctx.body = e.message;
    }
    console.log(e);
  }
};
