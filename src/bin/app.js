import program from 'commander';
import path from 'path';
import fs from 'fs';
import loggerService from '../services/logger';
import config from '../config';
import { version } from '../../package.json';
import Database from '../modules/Database';
import Fetcher from '../modules/Fetcher';
import serializeError from '../utils/serializeError';

program.version(version).usage('[options] <name>');

const category = 15;

(async function main() {
  const logger = loggerService(false);
  const database = new Database(':memory:');
  const fetcher = new Fetcher(database);

  fetcher.on('info', data => {
    logger.info(`For category: ${category}`);
    logger.info(
      Object.keys(data)
        .map(key => `${key}: ${data[key]}`)
        .join('\n')
    );
  });

  try {
    await database.init();
    await database.createRecordsTable();

    await fetcher.fetch(category);

    logger.info('Fetching Done, Saving to file');

    const data = await database.getAll();
    fs.writeFileSync(
      path.join(process.cwd(), 'data.json'),
      JSON.stringify({ data })
    );
  } catch (e) {
    logger.error(serializeError('Something went wrong', e));
  }
})();

program.parse(process.argv);
