const fileModel = require('./file-model');

const luhn = require('../../../libs/luhn.js')
const ApplicationError = require('../../../libs/application-error')

class fileCardsModel extends fileModel {
  constructor(sourceFile) {
    super(sourceFile);
  }

  async addCard (card) {
    console.log('adding card...')
    await this.readFile();
    const isValid = card
      && card.hasOwnProperty('cardNumber')
      && card.hasOwnProperty('balance')
      && /^[0-9]+$/.test(card.cardNumber)
      && luhn(card.cardNumber)
      && /^[0-9]+$/.test(card.balance);

    if (isValid) {
      card.id = await this.generateID();
      this.dataSource.push(card);
      await this.saveUpdates();
      return card;
    } else {
      throw new ApplicationError("Card data is invalid", 400);
    }
  }

  async changeAmount(id, amount) {
    await this.readFile();
    if (this.itemIDs.indexOf(id) === -1) {
      throw new ApplicationError("Card not found", 404);
    }
    const card = await this.getItem(id, 'Item');
    const index = this.dataSource.indexOf(card);
    card.balance += amount;
    this.dataSource.splice(index, 1, card);
    await this.saveUpdates();
  }
}

module.exports = fileCardsModel;
