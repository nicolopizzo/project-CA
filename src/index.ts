import express, { Request, Response } from 'express';
import { POIRouter } from './controllers/poi.controller';
import { AuthRouter } from './controllers/auth.controller';
import 'reflect-metadata';
import { AppDataSource } from './datasource';

const main = async () => {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  await AppDataSource.initialize();

  app.use('/poi', POIRouter);
  app.use('/auth', AuthRouter);

  app.listen(PORT, () => {
    console.log('Server started on port 3000');
  });
};

main();
