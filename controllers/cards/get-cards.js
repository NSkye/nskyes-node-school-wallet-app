'use strict';

const cardsModel = require('../../models/cards-model');

module.exports = async(ctx) => {
  ctx.body = await new cardsModel().getCards();
};
