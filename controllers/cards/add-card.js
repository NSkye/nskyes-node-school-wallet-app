'use strict';

const cardsModel = require('../../models/cardsModel');

module.exports = async(ctx) => {
  const card = ctx.request.body;
  try {
    const newCard = await new cardsModel().addCard(card);
    ctx.body = newCard;
  } catch (e) {
    if (e.status)
      ctx.throw(e.status, e.message);
    else
      ctx.throw(500, e.message);
  }
};
