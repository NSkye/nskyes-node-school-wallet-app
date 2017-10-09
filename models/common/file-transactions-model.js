const fileModel = require('./file-model');

const fs = require('fs');
const path = require('path');
const ApplicationError = require('../../libs/application-error');

class fileTransactionsModel extends fileModel {
  constructor(sourceFile, cardsFile) {
    super(sourceFile);
    this.cardsFile = path.join(__dirname, '..', '..', 'source', 'data', cardsFile);
    this.cardsSource = null;//require(this.cardsFile);
    this.cardIDs = null;//this.cardsSource.map((card) => card.id);
  }
  async readCardsFile() {
    if(!this.cardsSource) {
      return new Promise((resolve, reject) => {
        fs.readFile(this.cardsFile, (e, data) => {
          if(e)
            return reject(e);
          try {
            this.cardsSource = JSON.parse(data);
            this.cardIDs = this.cardsSource.map((item) => item.id);
            return resolve();
          } catch (err) {
            return reject(err);
          }
        });
      });
    }
    return this.cardsSource;
  }

  async addTransaction(transaction, cardID) {
    await this.readFile();
    await this.readCardsFile();
    const transactionTypes = ["paymentMobile", "prepaidCard", "card2Card"];
    const isValid = transaction && cardID
      && this.cardIDs.indexOf(cardID) != -1
      && 'data' in transaction
      && 'type' in transaction
      && 'sum' in transaction
      && transactionTypes.indexOf(transaction["type"]) != -1;

    if(isValid) {
      transaction.id = await this.generateID();
      transaction.cardId = cardID;
      transaction.time = Date();
      this.dataSource.push(transaction);
      await this.saveUpdates();
      return await transaction;
    } else {
      throw new ApplicationError("Card ID or transaction information is invalid", 400);
    }
  }

  async getTransactions(cardID) {
    await this.readFile();
    await this.readCardsFile();
    const isValid = this.cardIDs.indexOf(cardID) != -1;
    if (isValid) {
      const cardTransactions = this.dataSource.map((item) => {
        if (item.cardId === cardID)
          return item;
      }).filter(item => item);
      return await cardTransactions;
    } else {
      throw new ApplicationError("Card not found", 404);
    }
  }

  async deleteItem(id) {
    throw new ApplicationError("Transactions cannot be deleted", 400);
  }
}

module.exports = fileTransactionsModel;
