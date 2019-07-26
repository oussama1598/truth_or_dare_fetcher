import program from 'commander';
import path from 'path';
import loggerService from '../services/logger';
import config from '../config';
import { version } from '../../package.json';
import Database from '../modules/Database';
import Fetcher from '../modules/Fetcher';
import serializeError from '../utils/serializeError';

program.version(version).usage('[options] <name>');

(async function main() {
  const logger = loggerService(false);
  fetcher.on('info', data => {
      Object.keys(data)
        .map(key => `${key}: ${data[key]}`)
        .join('\n')
    );
  });

  try {
    await database.init();
    await database.createRecordsTable();

    await fetcher.fetch(15);

    logger.info('Fetching Done');
  } catch (e) {
    logger.error(serializeError('Something went wrong', e));
  }
})();

program.parse(process.argv);
