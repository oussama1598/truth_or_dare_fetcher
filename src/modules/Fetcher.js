import { EventEmitter } from 'events';
import { getTruth, getDare } from '../lib/game';

export default class Fetcher extends EventEmitter {
  constructor(database) {
    super();

    this.db = database;
    this.truthLength = 0;
    this.dareLength = 0;
  }

  async fetch(category) {
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

    const truthLength = this.db.getLengthOfType('truth', category);
    const dareLength = this.db.getLengthOfType('dare', category);

    this.emit('info', {
      totalTruthsFound: this.truthLength,
      totalDaresFound: this.dareLength,
      localTruthsLength: truthLength,
      localDaresLength: dareLength
    });

    if (truthLength < this.truthLength) return this.fetch(category);
    if (dareLength < this.dareLength) return this.fetch(category);

    return {
      truthLength,
      dareLength
    };
  }
}
