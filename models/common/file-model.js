const path = require('path');
const fs = require('fs');
const Model = require('./model');
const ApplicationError = require('../../libs/application-error')

class fileModel extends Model {
  constructor (sourceFile) {
    super();
    this.dataSourceFile = path.join(__dirname, '..', '..', 'source', 'data', sourceFile);
    this.dataSource = null;//require(this.dataSourceFile);
    this.itemIDs = null;//this.dataSource.map((item) => item.id);
  }

  async readFile () {
    if (!this.dataSource) {
      await new Promise ((resolve, reject) => {
        fs.readFile(this.dataSourceFile, (e, data) => {
          if (e)
            return reject(e);
          try {
            console.log(this.dataSourceFile);
            this.dataSource = JSON.parse(data);
            this.itemIDs = this.dataSource.map((item) => item.id);
            return resolve();
          } catch (err) {
            return reject(err);
          }
        });
      });
    }
    return {dataSource: this.dataSource, itemIDs: this.itemIDs};
  }

  async generateID() {
    this.readFile();
    const itemIDs = this.itemIDs;
    let newItemID = 1;
    if (this.itemIDs.length)
      newItemID = Math.max.apply(Math, this.itemIDs)+1;
    return await newItemID;
  }

  async getItems() {
    console.log('getting items...');
    await this.readFile();
    return this.dataSource;
  }

  async getItem (id, itemName = 'Item') {
    await this.readFile();
    const item = this.dataSource.find((item) => item.id === id);
    if (typeof item === 'undefined') {
      throw new ApplicationError(`${itemName} not found`, 404);
    } else {
      return await item;
    }
  }

  async deleteItem (id) {
    console.log('removing item...')
    await this.readFile();
    const item = await this.getItem(id, 'Item');
    const index = this.dataSource.indexOf(item);
    this.dataSource.splice(index, 1);
    await this.saveUpdates();
  }

  async saveUpdates() {
    if (this.dataSource) {
      return new Promise(resolve =>
        fs.writeFile(this.dataSourceFile, JSON.stringify(this.dataSource, null, 4),
        resolve));
    }
    console.log('Everything is up to date');
  }
}

module.exports = fileModel;
