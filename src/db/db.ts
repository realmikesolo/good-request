import 'dotenv/config';
import { Sequelize } from 'sequelize-typescript';
import { Env } from '../shared/env';
import { resolve } from 'node:path';

export const sequelize: Sequelize = new Sequelize({
  database: Env.DB_NAME,
  host: Env.DB_HOST,
  dialect: 'postgres',
  username: Env.DB_USER,
  password: Env.DB_PASSWORD,
  port: Env.DB_PORT,
  models: [resolve(__dirname, '../db/models/*.model.{ts,js}')],
});
