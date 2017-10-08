const fileModel = require('./file-model');

const luhn = require('../../libs/luhn.js')
const ApplicationError = require('../../libs/application-error')

class fileCardsModel extends fileModel {
  constructor(sourceFile) {
    super(sourceFile);
    this.cardIDs = this.dataSource.map((item) => item.id);
  }

  async getCard (id) {
    const card = this.dataSource.find((card) => card.id === id);
    if (typeof card === 'undefined') {
      throw new ApplicationError('Card not found', 404);
    } else {
      return await card;
    }
  }

  async getCards () {
    console.log('getting cards...');
    return await this.dataSource;
  }

  async addCard (card) {
    console.log('adding card...')
    const isValid = card
                    && card.hasOwnProperty('cardNumber')
                    && card.hasOwnProperty('balance')
                    && /^[0-9]+$/.test(card.cardNumber)
                    && luhn(card.cardNumber)
                    && /^[0-9]+$/.test(card.balance);

    if (isValid) {
      if (!this.cardIDs.length)
        card.id = 1;
      else
        card.id = Math.max.apply(Math, this.cardIDs)+1;
      this.dataSource.push(card);
      await this.saveUpdates();
      return card;
    } else {
      throw new ApplicationError("Card data is invalid", 400);
    }
  }

  async deleteCard (id) {
    console.log('removing card...')
    const card = await this.getCard(id);
    const index = this.dataSource.indexOf(card);
    this.dataSource.splice(index, 1);
    await this.saveUpdates();
  }
}

module.exports = fileCardsModel;
