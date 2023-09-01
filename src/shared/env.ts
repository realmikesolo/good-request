export const Env = {
  SERVER_PORT: Number(process.env.SERVER_PORT!),
  SERVER_HOST: process.env.SERVER_HOST!,

  DB_NAME: process.env.DB_NAME!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_USER: process.env.DB_USER!,
  DB_PORT: Number(process.env.DB_PORT!),
  DB_HOST: process.env.DB_HOST!,
};
