'use strict';

const cardsModel = require('../models/cardsModel');

module.exports = (req, res) => res.json(new cardsModel().getCards());
