const path = require('path');
const fs = require('fs');
const Model = require('./model');
const luhn = require('../../libs/luhn.js')
const ApplicationError = require('../../libs/application-error')

class fileCardsModel extends Model {
  constructor(sourceFile) {
    super();
    this.dataSourceFile = path.join(__dirname, '..', '..', 'source', 'data', sourceFile);
    this.dataSource = require(this.dataSourceFile);
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
    const card = this.dataSource.find((card) => card.id === id);

    if (typeof card === 'undefined') {
      throw new ApplicationError('Card not found', 404);
    } else {
      const index = this.dataSource.indexOf(card);
      this.dataSource.splice(index, 1);
      await this.saveUpdates();
    }
  }

  async saveUpdates() {
    return new Promise(resolve =>
      fs.writeFile(this.dataSourceFile, JSON.stringify(this.dataSource, null, 4),
      resolve));
  }
}

module.exports = fileCardsModel;
