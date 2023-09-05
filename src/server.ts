import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response, Router } from 'express';
import { ZodError } from 'zod';
import { BadRequestException, HttpException, InternalServerErrorException } from './core/http-exceptions';
import passport from 'passport';
import { initPassport } from './app/strategies/jwt.strategy';
import { I18n } from 'i18n';
import { resolve } from 'node:path';

const i18n = new I18n({
  header: 'language',
  defaultLocale: 'en',
  locales: ['en', 'sk'],
  directory: resolve(__dirname, '../locales'),
});

export async function startServer(options: {
  host: string;
  port: number;
  routers: Array<(router: Router) => void>;
}): Promise<void> {
  const { host, port, routers } = options;

  initPassport(passport);

  const app = express();

  app.use(i18n.init);
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  for (const router of routers) {
    const routerInstance = Router();
    router(routerInstance);

    app.use(routerInstance);
  }

  app.use(errorHandler);

  app.listen(port, host, () => {
    console.log('Server started on', port);
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler(error: any, req: Request, res: Response, next: NextFunction): void {
  if (error instanceof HttpException) {
    res.status(error.status).send(error.body);
  } else if (error instanceof ZodError) {
    const exception = new BadRequestException();
    res.status(exception.status).send(error.format());
  } else {
    console.error(error);

    const exception = new InternalServerErrorException();
    res.status(exception.status).send(exception.body);
  }
}
