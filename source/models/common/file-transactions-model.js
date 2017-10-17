const fileModel = require('./file-model');

const fs = require('fs');
const path = require('path');
const ApplicationError = require('../../../libs/application-error');
const iso = require('../../../libs/ISO8601')


class fileTransactionsModel extends fileModel {
  constructor(sourceFile, cardsSource = null) {
    super(sourceFile);
    this.cardsSource = cardsSource;
    this.cardIDs = (cardsSource) ? this.cardsSource.map((card) => card.id) : null;
  }

  async addTransaction(transaction, cardID) {
    if(!this.cardsSource) {
      throw new ApplicationError("Cannot add transactions without cards source", 400);
    }
    await this.readFile();
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
      const date = new Date();
      transaction.time = iso(date);
      this.dataSource.push(transaction);
      await this.saveUpdates();
      return await transaction;
    } else {
      throw new ApplicationError("Card ID or transaction information is invalid", 400);
    }
  }

  async getTransactions(cardID) {
    if(!this.cardsSource) {
      throw new ApplicationError("Cannot get card transactions without cards source", 400);
    }
    await this.readFile();
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
