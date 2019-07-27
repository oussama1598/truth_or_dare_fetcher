import sqlite3 from 'better-sqlite3';

export default class Database {
  constructor(filename) {
    this.db = sqlite3(filename);

    this.createRecordsTable();
  }

  createRecordsTable() {
    this.db
      .prepare(
        `CREATE TABLE IF Not EXISTS records(
        id INT PRIMARY KEY NOT NULL,
        type VARCHAR(255),
        content TEXT,
        category INT
    )`
      )
      .run();
  }

  checkIfItemExists(item) {
    return this.db
      .prepare(
        'SELECT count(id) FROM records WHERE id=? AND type=? AND category=?'
      )
      .get(item.id, item.type, item.category)['count(id)'];
  }

  getLengthOfType(type) {
    return this.db
      .prepare('SELECT count(id) FROM records WHERE type=?')
      .get(type)['count(id)'];
  }

  addItem(item) {
    return this.db
      .prepare('INSERT INTO records VALUES(?, ?, ?, ?)')
      .run(item.id, item.type, item.content, item.category);
  }
}
