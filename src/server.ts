import express from 'express';

export async function startServer(options: { host: string; port: number; routers: any }): Promise<void> {
  const { host, port, routers } = options;

  const app = express();

  for (const router of routers) {
    app.use(router);
  }

  app.listen(port, host, () => {
    console.log('Server started on', port);
  });
}
