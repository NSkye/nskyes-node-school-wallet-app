'use strict';

const transactionsModel = require('../../models/transactions-model');

module.exports = async (ctx) => {
  const id = Number(ctx.params.id);
  try {
    await new transactionsModel().deleteItem(id);
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
