'use strict';

const cardsModel = require('../../models/cards-model');

module.exports = async (ctx) => {
  const id = Number(ctx.params.id);
  try {
    await new cardsModel().deleteItem(id);
    ctx.status = 200;
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
