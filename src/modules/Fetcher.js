import { EventEmitter } from 'events';
import { getTruth, getDare } from '../lib/game';

export default class Fetcher extends EventEmitter {
  constructor(database) {
    super();

    this.categories = [15, 6, 11, 9];

    this.db = database;
    this.truthLength = 0;
    this.dareLength = 0;
  }

  async fetch() {
    const category = this.categories[Math.floor(Math.random() * 5)];
    const truth = await getTruth(category);
    const dare = await getDare(category);

    if (!this.db.checkIfItemExists(truth)) {
      if (truth.id > this.truthLength) this.truthLength = truth.id;

      this.db.addItem(truth);
    }

    if (!this.db.checkIfItemExists(dare)) {
      if (dare.id > this.dareLength) this.dareLength = dare.id;

      this.db.addItem(dare);
    }

    const truthLength = this.db.getLengthOfType('truth');
    const dareLength = this.db.getLengthOfType('dare');

    this.emit('info', {
      totalTruthsFound: this.truthLength,
      totalDaresFound: this.dareLength,
      localTruthsLength: truthLength,
      localDaresLength: dareLength
    });

    if (truthLength < this.truthLength) return this.fetch();
    if (dareLength < this.dareLength) return this.fetch();

    return {
      truthLength,
      dareLength
    };
  }
}
