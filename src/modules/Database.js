import Loki from 'lokijs';

export default class Database {
  constructor(filename) {
    this.db = new Loki(filename);
    this.collection = this.db.addCollection('records');
  }

  async checkIfItemExists({ id, type, category }) {
    const results = this.collection.find({ id, type, category });

    return !!results.length;
  }

  async getLengthOfType(type, category) {
    const results = this.collection.find({ type, category });

    return results.length;
  }

  addItem({ id, type, content, category }) {
    this.collection.insert({ id, type, content, category });
  }

  save() {
    this.db.saveDatabase();
  }
}
