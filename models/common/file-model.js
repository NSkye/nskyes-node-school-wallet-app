const path = require('path');
const fs = require('fs');
const Model = require('./model');
const ApplicationError = require('../../libs/application-error')

class fileModel extends Model {
  constructor (sourceFile) {
    super();
    this.dataSourceFile = path.join(__dirname, '..', '..', 'source', 'data', sourceFile);
    this.dataSource = require(this.dataSourceFile);
  }

  async saveUpdates() {
    return new Promise(resolve =>
      fs.writeFile(this.dataSourceFile, JSON.stringify(this.dataSource, null, 4),
      resolve));
  }
}

module.exports = fileModel;
