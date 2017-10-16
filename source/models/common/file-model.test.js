const path = require('path');
const fileModel = require('./file-model');
const tests = {
  readFile: {
    returnsObject: 'new fileModel("cards.json"); fileModel.readFile() should return an object with 2 arrays within it',
    modelHasNoDataBeforeReading: 'fileModel.itemIDs & fileModel.dataSource should be nulls before reading',
    modelHasDataAfterReading: 'fileModel.itemIDs & fileModel.dataSource should NOT be nulls after reading',
    wontReadUnexistingFile: 'Attempt to read unexisting file should lead to ENOENT or EISDIR error'
  },
  generateID: {
    generatesUniqueID: 'model.generateID() should generate a unique ID'
  },
  getItems: {
    returnsArray: 'model.getItems() should return an array'
  },
  getItem: {
    returnsObject: 'model.getItem(itemID) should return an object',
    shouldErrorOnUnexistingItem: 'Attempt to get unexisting item should lead to error'
  }
}
expect.extend({
  toBeOneOf(recieved, array) {
    if (array.indexOf(recieved) != -1) {
      return {
        message: () => (
          `expected value that does NOT match any of following elements: ${array}; got: ${recieved}`
        ),
        pass: true
      }
    } else {
      return {
        message: () => (
          `expected value that does match following elements: ${array}; got: ${recieved}`
        ),
        pass: false
      }
    }
  }
});
const cardsPath = path.join(__dirname, '..', '..', 'data', 'cards.json');

let model = null;
jest.mock('fs');
const fs = require('fs');

const prepareModel = async () => {
  model = new fileModel('cards.json');
  await model.readFile();
  return model;
}

describe('readFile tests', () => {
  test(tests.readFile.returnsObject, async () => {
    expect.assertions(3);
    const model = new fileModel('cards.json');
    const data = await model.readFile();
    expect(typeof data).toBe('object');
    expect(Array.isArray(data.dataSource)).toBe(true);
    expect(Array.isArray(data.itemIDs)).toBe(true);
    console.log(data.dataSource);
  });
  test(tests.readFile.modelHasNoDataBeforeReading, async () => {
    expect.assertions(2);
    const model = new fileModel('cards.json');
    expect(model.dataSource).toBeNull();
    expect(model.itemIDs).toBeNull();
  });
  test(tests.readFile.modelHasDataAfterReading, async () => {
    expect.assertions(2);
    const model = new fileModel('cards.json');
    const data = await model.readFile();
    expect(model.dataSource).not.toBeNull();
    expect(model.itemIDs).not.toBeNull();
  });
  test(tests.readFile.wontReadUnexistingFile, async () => {
    jest.dontMock('fs');
    expect.assertions(1);expect
    try {
      const model = new fileModel();
      await model.readFile();
    } catch (e) {
      expect(e.message).toMatch(/(^ENOENT)|(^EISDIR)/);
    }
  });
});

describe('Other tests', () => {
  beforeEach( async () => {
     await prepareModel();
  });
  afterEach(() => {
    return model = null;
  });
  test(tests.generateID.generatesUniqueID, async () => {
    expect.assertions(1);
    expect(await model.generateID()).not.toBeOneOf(model.itemIDs);
    console.log(model.itemIDs);
  });
  test('deleteItem(itemID) should call saveUpdates() whilist saveUpdates() should call fs.writeFile() with correct arguments', async () => {
    expect.assertions(2);
    jest.spyOn(fileModel.prototype, 'saveUpdates');
    jest.spyOn(fs, 'writeFile');
    let items = JSON.parse(JSON.stringify(model.dataSource));
    items.splice(0, 1);
    items = JSON.stringify(items, null, 4);
    await model.deleteItem(1);
    expect(fileModel.prototype.saveUpdates).toHaveBeenCalled();
    expect(fs.writeFile).toHaveBeenCalledWith(cardsPath, items, expect.anything());
  });
  describe('get item(s)', () => {
    test(tests.getItems.returnsArray, async () => {
      expect.assertions(1);
      const items = await model.getItems();const newID = await model.generateID();
      expect(Array.isArray(items)).toBe(true);
    });
    test(tests.getItem.returnsObject, async () => {
      let iterator = 1;
      expect.assertions(iterator);

      const IDs = model.itemIDs;
      while (iterator) {
        const randomID = IDs[Math.floor(Math.random()*IDs.length)];
        expect(typeof model.getItem(randomID)).toBe('object');
        iterator--;
      }
    });
    test(tests.getItem.shouldErrorOnUnexistingItem, async () => {
      expect.assertions(1);
      try {
        await model.getItem(-1);
      } catch (e) {
        expect(e.statusCode).toBeOneOf([400, 404]);
      }
    });

  });

})
