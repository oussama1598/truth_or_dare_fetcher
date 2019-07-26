import Loki from 'lokijs';

export default class Database {
  constructor(filename) {
    this.db = new Loki(filename);
    this.collection = this.db.addCollection('records');
  }

  init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.filename, err => {
        if (err) return reject(err);

        return resolve();
      });
    });
  }

  asyncRun(request, params) {
    return new Promise((resolve, reject) => {
      this.db.run(request, params, err => {
        if (err) return reject(err);

        return resolve();
      });
    });
  }

  createRecordsTable() {
    return this.asyncRun(`CREATE TABLE IF Not EXISTS records(
        id INT PRIMARY KEY NOT NULL,
        type VARCHAR(255),
        content TEXT,
        category INT
    )`);
  }

  getData(request, params) {
    return new Promise((resolve, reject) =>
      this.db.all(request, params, (err, res) => {
        if (err) return reject(err);

        return resolve(res);
      })
    );
  }

  async checkIfItemExists($id, $type) {
    const results = await this.getData(
      'SELECT * FROM records WHERE id=$id AND type=$type',
      {
        $id,
        $type
      }
    );

    return !!results.length;
  }

  async getLengthOfType($type) {
    const results = await this.getData(
      'SELECT * FROM records WHERE type=$type',
      {
        $type
      }
    );

    return results.length;
  }

  addItem({ id, type, content, category }) {
    this.collection.insert({ id, type, content, category });
  }
}
