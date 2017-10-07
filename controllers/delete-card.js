'use strict';

const cardsModel = require('../models/cardsModel');

module.exports = (req, res) => {
  const id = Number(req.params['id']);
  try {
    const delCard = new cardsModel().deleteCard(id);
    res.sendStatus(200);
  } catch (e) {
    if (e.status)
      res.status(e.status);
    res.send(e.message);
  }
};
