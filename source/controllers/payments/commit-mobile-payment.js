'use strict';

const transactionsModel = require('../../models/transactions-model');
const cardsModel = require('../../models/cards-model');

module.exports = async (ctx) => {
  const cardID = Number(ctx.params.id);
  const cards = await new cardsModel().getItems();
  const payment = ctx.request.body;
  try {
   await  new cardsModel().changeAmount(cardID, Number(payment.amount) * -1);
   const transaction = await new transactionsModel(cards)
    .addTransaction({
      data: '+79218908064',
      type: 'paymentMobile',
      sum: Number(payment.amount) * -1
    }, cardID);
   ctx.body = transaction;
  } catch (e) {
    if (e.status) {
      ctx.status = e.status;
      ctx.body = e;
    }
    else {
      ctx.status = 500;
      ctx.body = e;
    }
  }
};
