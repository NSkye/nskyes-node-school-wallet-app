'use strict';

const cardsModel = require('../../models/cards-model');

module.exports = async(ctx) => {
  const card = ctx.request.body;
  try {
    const newCard = await new cardsModel().addCard(card);
    ctx.body = newCard;
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
