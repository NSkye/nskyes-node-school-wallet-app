'use strict';

const cardsModel = require('../../models/cardsModel');

module.exports = async (ctx) => {
  const id = Number(ctx.params.id);
  try {
    await new cardsModel().deleteCard(id);
    ctx.status = 200;
  } catch (e) {
    if (e.status)
      ctx.throw(e.status, e.message);
    else
      ctx.throw(500, e.message);
  }
};
