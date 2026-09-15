import { fileURLToPath } from 'node:url';
import { SequelizeStorage, Umzug } from 'umzug';

import { sequelize } from './database.js';

const extension = import.meta.url.endsWith('.ts') ? 'ts' : 'js';

const seedersGlob = fileURLToPath(
  new URL(`../seeders/*.${extension}`, import.meta.url)
);

const seeder = new Umzug({
  migrations: { glob: seedersGlob },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize,
    modelName: 'SequelizeDataSeeders',
  }),
  logger: console,
});

try {
  await seeder.up();
} finally {
  await sequelize.close();
}