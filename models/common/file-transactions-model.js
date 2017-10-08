const fileModel = require('./file-model');

const path = require('path');
const ApplicationError = require('../../libs/application-error');

class fileTransactionsModel extends fileModel {
  constructor(sourceFile, cardsFile) {
    super(sourceFile);
    this.cardsFile = path.join(__dirname, '..', '..', 'source', 'data', cardsFile);
    this.cardsSource = require(this.cardsFile);
    this.cardIDs = this.cardsSource.map((card) => card.id);
  }
  async addTransaction(transaction, cardID) {
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
