import 'dotenv/config';
import { Env } from './shared/env';
import { startServer } from './server';
import { sequelize } from './db/db';

(async () => {
  await sequelize.sync();

  console.log('DB sync done');

  await startServer({
    host: Env.SERVER_HOST,
    port: Env.SERVER_PORT,
    routers: [],
  });
})();
