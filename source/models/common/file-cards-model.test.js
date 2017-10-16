const path = require('path');
const cardsModel = require('./file-cards-model');
const cardsPath = path.join(__dirname, '..', '..', 'data', 'cards.json');

let model = null;
jest.mock('fs');
const fs = require('fs');

const prepareModel = async () => {
  model = new cardsModel('cards.json');
  await model.readFile();
  return model;
}

beforeEach(async () => {
  await prepareModel();
  jest.clearAllMocks();
});

afterEach(() => {
  model = null;
});

describe('addCard', () => {

  test("Passing cards with incorrect data should lead to application error with code 400", async () => {
    expect.assertions(4);
    try {
      await model.addCard();
    } catch (e) {
      expect(e.statusCode).toBe(400);
    }
    try {
      await model.addCard({});
    } catch (e) {
      expect(e.statusCode).toBe(400);
    }
    try {
      await model.addCard({'balance': null, 'cardNumber': null});
    } catch (e) {
      expect(e.statusCode).toBe(400);
    }
    try {
      await model.addCard({'balance': 404, 'cardNumber': 'one'});1
    } catch (e) {
      expect(e.statusCode).toBe(400);
    }
  });

  test("Adding card with correct data should call certain methods and return passed card with id", async () => {
    expect.assertions(4);
    jest.spyOn(cardsModel.prototype, 'readFile');
    jest.spyOn(cardsModel.prototype, 'saveUpdates');
    jest.spyOn(cardsModel.prototype, 'generateID');
    const card = {'balance': 10, 'cardNumber': 99999999}
    const result = await model.addCard(card);
    expect(cardsModel.prototype.readFile).toBeCalled();
    expect(cardsModel.prototype.saveUpdates).toBeCalled();
    expect(cardsModel.prototype.generateID).toBeCalled();
    expect(result).toHaveProperty('id', 3);
  });

});

describe('changeAmount', () => {

  test("Passing wrong id or not passing it at all should lead to application error with code 404", async () => {
    expect.assertions(2);
    try {
      await model.changeAmount();
    } catch (e) {
      expect(e.statusCode).toBe(404);
    }
    try {
      await model.changeAmount(0);
    } catch (e) {
      expect(e.statusCode).toBe(404);
    }
  });

  test("Passing wrong amount or not passing it at all should lead to application error with code 400", async () => {
    expect.assertions(4);
    try {
      await model.changeAmount(1);
    } catch (e) {
      expect(e.statusCode).toBe(400);
    }
    try {
      await model.changeAmount(1, 'abc');
    } catch (e) {
      expect(e.statusCode).toBe(400);
    }
    try {
      await model.changeAmount(1, 0);
    } catch (e) {
      expect(e.statusCode).toBe(400);
    }
    try {
      await model.changeAmount(1, '8-5');
    } catch (e) {
      expect(e.statusCode).toBe(400);
    }
  });

  test("Passing correct amount should call certain methods, passing string amount should also be valid", async () => {
    const id = 1;
    const amount = 256;
    const card = await model.getItem(id);
    const shouldBe = card.balance + amount;
    jest.spyOn(cardsModel.prototype, 'getItem');
    jest.spyOn(cardsModel.prototype, 'saveUpdates');

    await model.changeAmount(id, amount);
    expect(cardsModel.prototype.getItem).toBeCalledWith(id, expect.anything());
    expect(cardsModel.prototype.saveUpdates).toBeCalled();
    expect(model.dataSource[0].balance).toBe(shouldBe); //В тесте не используем получение элемента по ID, так как модуль работает с Моком, в котором мы знаем положение нужного нам элемента

    model = new cardsModel('cards.json');
    await model.changeAmount(id, amount.toString());
    expect(model.dataSource[0].balance).toBe(shouldBe);
  });

});
