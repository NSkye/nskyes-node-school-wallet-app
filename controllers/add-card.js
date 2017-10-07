'use strict';

const cardsModel = require('../models/cardsModel');

module.exports = (req, res) => {
  const card = req.body;
  try {
    const newCard = new cardsModel().addCard(card);
    res.json(newCard);
  } catch (e) {
    if (e.status)
      res.status(e.status);
    res.send(e.message);
  }
};
