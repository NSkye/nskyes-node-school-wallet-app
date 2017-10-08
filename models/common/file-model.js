const path = require('path');
const fs = require('fs');
const Model = require('./model');
const ApplicationError = require('../../libs/application-error')

class fileModel extends Model {
  constructor (sourceFile) {
    super();
    this.dataSourceFile = path.join(__dirname, '..', '..', 'source', 'data', sourceFile);
    this.dataSource = require(this.dataSourceFile);
    this.itemIDs = this.dataSource.map((item) => item.id);
  }
  async generateID() {
    let itemID = 1;
    if (this.itemIDs.length)
      itemID = Math.max.apply(Math, this.itemIDs)+1;
    return await itemID;
  }
  async getItems() {
    console.log('getting items...');
    return await this.dataSource;
  }
  async getItem (id, itemName = 'Item') {
    const item = this.dataSource.find((item) => item.id === id);
    if (typeof item === 'undefined') {
      throw new ApplicationError(`${itemName} not found`, 404);
    } else {
      return await item;
    }
  }
  async saveUpdates() {
    return new Promise(resolve =>
      fs.writeFile(this.dataSourceFile, JSON.stringify(this.dataSource, null, 4),
      resolve));
  }
}

module.exports = fileModel;
