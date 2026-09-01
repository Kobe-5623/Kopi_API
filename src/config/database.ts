import { Sequelize } from 'sequelize';
import { env } from './env.js';

export const sequelize = new Sequelize(env.databaseUrl, {
  dialect: 'mysql',
  logging: env.nodeEnv === 'development' ? console.log : false,
});
