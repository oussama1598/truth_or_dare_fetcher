import { EventEmitter } from 'events';
import { getTruth, getDare } from '../lib/game';

export default class Fetcher extends EventEmitter {
  constructor(database) {
    super();

    this.db = database;
    this.truthLength = 0;
    this.dareLength = 0;
    this.category = 35;
  }

  async fetch() {
    const category = this.category % 36;
    console.log('Category', category);
    const truth = await getTruth(category);
    const dare = await getDare(category);

    if (truth.id > this.truthLength) this.truthLength = truth.id;
    if (dare.id > this.dareLength) this.dareLength = dare.id;

    if (truth && !this.db.checkIfItemExists(truth)) this.db.addItem(truth);

    if (dare && !this.db.checkIfItemExists(dare)) this.db.addItem(dare);

    const truthLength = this.db.getLengthOfType('truth');
    const dareLength = this.db.getLengthOfType('dare');

    this.emit('info', {
      totalTruthsFound: this.truthLength,
      totalDaresFound: this.dareLength,
      localTruthsLength: truthLength,
      localDaresLength: dareLength
    });

    this.category += 1;

    if (truthLength < this.truthLength) return this.fetch();
    if (dareLength < this.dareLength) return this.fetch();

    return {
      truthLength,
      dareLength
    };
  }
}
