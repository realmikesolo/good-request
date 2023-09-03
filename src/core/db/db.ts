import 'dotenv/config';
import { resolve } from 'node:path';
import { Sequelize } from 'sequelize-typescript';
import { Env } from '../env';

export const sequelize: Sequelize = new Sequelize({
  database: Env.DB_NAME,
  host: Env.DB_HOST,
  dialect: 'postgres',
  username: Env.DB_USER,
  password: Env.DB_PASSWORD,
  port: Env.DB_PORT,
  models: [resolve(__dirname, '../../app/models/*.model.{ts,js}')],
});
