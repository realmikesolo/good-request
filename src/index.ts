import 'dotenv/config';
import { Env } from './core/env';
import { startServer } from './server';
import { sequelize } from './core/db/db';
import { exerciseRouter } from './app/routes/exercise.router';
import { programRouter } from './app/routes/program.router';

(async () => {
  await sequelize.sync();

  console.log('DB sync done');

  await startServer({
    host: Env.SERVER_HOST,
    port: Env.SERVER_PORT,
    routers: [exerciseRouter, programRouter],
  });
})();
