'use strict';

const cardsModel = require('../../models/cardsModel');

module.exports = async(ctx) => {
  ctx.body = await new cardsModel().getCards();
};
