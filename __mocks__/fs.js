'use strict';

const path = require('path');
const fs = jest.genMockFromModule('fs');
const fakeCards = [
    {
        "cardNumber": "4561261212345467",
        "balance": 1,
        "id": 1
    },
    {
        "cardNumber": "546925000000000",
        "balance": 2,
        "id": 2
    }
];
const fakeTransactions = [
    {
        "data": "5469 2500 0000 000",
        "type": "card2Card",
        "sum": -7,
        "id": 1,
        "cardId": 1,
        "time": "\"2017-10-12T12:18:46.711Z\""
    },
    {
        "data": "4561 2612 1234 5467",
        "type": "card2Card",
        "sum": 7,
        "id": 2,
        "cardId": 2,
        "time": "\"2017-10-12T12:18:46.712Z\""
    }
];
const cardsPath = path.join(__dirname, '..', 'source', 'data', 'cards.json');
const transactionsPath = path.join(__dirname, '..', 'source', 'data', 'transactions.json');

let fakePaths = {};
fakePaths[cardsPath] = fakeCards;
fakePaths[transactionsPath] = fakeTransactions;
/*
const fakePaths = {
  '/home/skye/Documents/Yandex/nskyes-node-school-wallet-app/source/data/cards.json': fakeCards,
  '/home/skye/Documents/Yandex/nskyes-node-school-wallet-app/source/data/transactions.json': fakeTransactions
}*/

const readFile = async (filePath, callback) => {
  await new Promise ((resolve, reject) => {
    if (fakePaths[filePath]) {
      const data = fakePaths[filePath];
      resolve(callback(null, JSON.stringify(data)));
    } else {
      try {
        throw new Error("EISDIR");
      } catch (e) {
        resolve(callback(e, null));
      }
    }
  });
}
const writeFile = async (filePath, data, callback) => {
  await new Promise ((resolve, reject) => {
    if (fakePaths[filePath]) {
      resolve(callback());
    } else {
      try {
        throw new Error("EISDIR");
      } catch (e) {
        resolve(callback(e));
      }
    }
  }).catch((e) => {
    reject(e);
  });
}

fs.readFile = readFile;
fs.writeFile = writeFile;

module.exports = fs;
