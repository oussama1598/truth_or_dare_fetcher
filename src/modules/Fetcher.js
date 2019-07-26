import { EventEmitter } from 'events';
import { getTruth, getDare } from '../lib/game';

export default class Fetcher extends EventEmitter {
  constructor(database) {
    super();

    this.db = database;
    this.truthLength = 0;
    this.dareLength = 0;
  }

  async fetch() {
    const category = Math.floor(Math.random() * 36);
    console.log('Category', category);
    const truth = await getTruth(category);
    const dare = await getDare(category);

    if (truth && !this.db.checkIfItemExists(truth)) {
      if (truth.id > this.truthLength) this.truthLength = truth.id;

      this.db.addItem(truth);
    }

    if (dare && !this.db.checkIfItemExists(dare)) {
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
