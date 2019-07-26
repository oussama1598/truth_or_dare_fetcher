import sqlite3 from 'sqlite3';
import promisify from '../utils/promisify';

export default class Database {
  constructor(filename) {
    this.filename = filename;
    this.db = null;
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

  async checkIfItemExists(item) {
    const results = await this.getData(
      'SELECT * FROM records WHERE id=$id AND type=$type AND $category=$category',
      {
        $id: item.id,
        $type: item.type,
        $category: item.category
      }
    );

    return !!results.length;
  }

  async getLengthOfType($type, $category) {
    const results = await this.getData(
      'SELECT * FROM records WHERE type=$type AND $category=$category',
      {
        $type,
        $category
      }
    );

    return results.length;
  }

  addItem(item) {
    return this.asyncRun(
      'INSERT INTO records VALUES($id, $type, $content, $category)',
      {
        $id: item.id,
        $type: item.type,
        $content: item.content,
        $category: item.category
      }
    );
  }

  async getAll() {
    return this.getData('SELECT * FROM records');  
  }
}
