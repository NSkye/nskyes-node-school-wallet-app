'use strict';

const transactionsModel = require('../../models/transactions-model');
const cardsModel = require('../../models/cards-model');

module.exports = async (ctx) => {
  const cardID = Number(ctx.params.id);
  const cards = await new cardsModel().getItems();
  const payment = ctx.request.body;
  const amount = Number(payment.amount);
  const to = Number(payment.to);
  try {
   await new cardsModel().changeAmount(cardID, amount * -1);
   await new cardsModel().changeAmount(to, amount);
   const transactionFrom = await new transactionsModel(cards)
    .addTransaction({
      data: '00000000000',
      type: 'card2Card',
      sum: amount * -1
    }, cardID);
  const transactionTo = await new transactionsModel(cards)
    .addTransaction({
      data: '00000000000',
      type: 'card2Card',
      sum: amount
    }, to);
   ctx.body = [transactionFrom, transactionTo];
  } catch (e) {
    if (e.status) {
      ctx.status = e.status;
      ctx.body = e.message;
    }
    else {
      ctx.status = 500;
      ctx.body = e.message;
    }
  }
};
