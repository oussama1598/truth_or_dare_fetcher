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

    if (!(await this.db.checkIfItemExists(truth.id, truth.type))) {
      if (truth.id > this.truthLength) this.truthLength = truth.id;

      this.db.addItem(truth);
    }

    if (!(await this.db.checkIfItemExists(dare.id, dare.type))) {
      if (dare.id > this.dareLength) this.dareLength = dare.id;

      await this.db.addItem(dare);
    }

    const truthLength = await this.db.getLengthOfType('truth');
    const dareLength = await this.db.getLengthOfType('dare');

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
