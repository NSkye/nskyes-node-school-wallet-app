const fileModel = require('./file-model');

const luhn = require('../../libs/luhn.js')
const ApplicationError = require('../../libs/application-error')

class fileCardsModel extends fileModel {
  constructor(sourceFile) {
    super(sourceFile);
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
      card.id = await this.generateID();
      this.dataSource.push(card);
      await this.saveUpdates();
      return card;
    } else {
      throw new ApplicationError("Card data is invalid", 400);
    }
  }

  async deleteCard (id) {
    console.log('removing card...')
    const card = await this.getItem(id, 'Card');
    const index = this.dataSource.indexOf(card);
    this.dataSource.splice(index, 1);
    await this.saveUpdates();
  }
}

module.exports = fileCardsModel;
