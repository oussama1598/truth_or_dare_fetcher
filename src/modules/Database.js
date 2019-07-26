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
    const results = this.db
      .prepare('SELECT * FROM records WHERE id=? AND type=? AND category=?')
      .all(item.id, item.type, item.category);

    return !!results.length;
  }

  getLengthOfType(type) {
    const results = this.db
      .prepare('SELECT * FROM records WHERE type=?')
      .all(type);

    return results.length;
  }

  addItem(item) {
    return this.db
      .prepare('INSERT INTO records VALUES(?, ?, ?, ?)')
      .run(item.id, item.type, item.content, item.category);
  }
}
