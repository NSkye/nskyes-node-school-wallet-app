const path = require('path');
const transactionsModel = require('./file-transactions-model');
const cardsModel = require('./file-cards-model');
const transactionsPath = path.join(__dirname, '..', '..', 'data', 'transactions.json');

let model = null;
jest.mock('fs');
const fs = require('fs');

const prepareModel = async () => {
  const cardsM = new cardsModel('cards.json');
  const cards = await cardsM.getItems();
  model = new transactionsModel('transactions.json', cards);
  await model.readFile();
  return model;
}

beforeEach(async () => {
  await prepareModel();
  jest.clearAllMocks();
  jest.mock('fs');
});

afterEach(() => {
  model = null;
});

describe('addTransaction', () => {
  test('addTransaction should return transaction object with id, time and cardID', async () => {
    expect.assertions(3);
    const transaction = {
      'data': '00000000000',
      'type': 'paymentMobile',
      'sum': -400
    }
    const newTransaction = await model.addTransaction(transaction, 1);
    expect(newTransaction).toHaveProperty('id');
    expect(newTransaction).toHaveProperty('time');
    expect(newTransaction).toHaveProperty('cardId', 1);
  });

  test('addTransaction should trigger generateID, saveUpdates and writeFile methods', async () => {
    expect.assertions(3);
    jest.spyOn(transactionsModel.prototype, 'generateID');
    jest.spyOn(transactionsModel.prototype, 'saveUpdates');
    jest.spyOn(fs, 'writeFile');
    const transaction = {
      'data': '00000000000',
      'type': 'paymentMobile',
      'sum': -400
    }
    const newTransaction = await model.addTransaction(transaction, 1);
    expect(transactionsModel.prototype.generateID).toBeCalled();
    expect(transactionsModel.prototype.saveUpdates).toBeCalled();
    expect(fs.writeFile).toHaveBeenCalledWith(transactionsPath, expect.anything(), expect.anything());
  });

  test('adding transaction without cardsSource to app error with code 400', async () => {
    model = new transactionsModel('transactions.json');
    try {
      await model.addTransaction({
        'data': '00000000000',
        'type': 'paymentMobile',
        'sum': -400
      }, 1);
    } catch (e) {
      expect(e.statusCode).toBe(400);
    }
  });

  test('adding transactions with wrong data should lead to app error with code 400', async () => {
    expect.assertions(4);
    try {
      await model.addTransaction({
        'type': 'paymentMobile',
        'sum': -400
      }, 1);
    } catch (e) {
      expect(e.statusCode).toBe(400);
    }
    try {
      await model.addTransaction({
        'data': '00000000000',
        'type': 'huh?',
        'sum': -400
      }, 1);
    } catch (e) {
      expect(e.statusCode).toBe(400);
    }
    try {
      await model.addTransaction({
        'type': 'paymentMobile',
        'sum': -400
      }, 1);
    } catch (e) {
      expect(e.statusCode).toBe(400);
    }
    try {
      await model.addTransaction({
        'data': '00000000000',
        'type': 'paymentMobile',
        'sum': -400
      }, -1);
    } catch (e) {
      expect(e.statusCode).toBe(400);
    }
  });
});

describe('getTransactions', () => {
  test('attempt to get transactions for card without passing ID should leed to error with code 404', async () => {
    expect.assertions(1);
    try {
      await model.getTransactions();
    } catch (e) {
      expect(e.statusCode).toBe(404);
    }
  });

  test('attempt to get transactions for wrong card should lead to 404 error', async () => {
    expect.assertions(1);
    try {
      await model.getTransactions(-1);
    } catch (e) {
      expect(e.statusCode).toBe(404);
    }
  });

  test('getTransactions should return an array', async () => {
    expect.assertions(1);
    const result = await model.getTransactions(1);
    expect(Array.isArray(result)).toBe(true);
  });
});

test('deleteItem should lead to 400 error and not trigger writeFile', async () => {
  expect.assertions(2);
  jest.spyOn(fs, 'writeFile');
  try {
    await model.deleteItem(1);
  } catch (e) {
    expect(e.statusCode).toBe(400);
  }
  expect(fs.writeFile).not.toBeCalled();
});
