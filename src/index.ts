import express, { Request, Response } from 'express';
import { POIRouter } from './controllers/poi.controller';
import { AuthRouter } from './controllers/auth.controller';
import 'reflect-metadata';
import { AppDataSource } from './datasource';
import cors from 'cors';
import { ActivityRouter } from './controllers/activity.controller';
import { ProfileRouter } from './controllers/profile.controller';

const main = async () => {
  const app = express();
  const PORT = 3001;

  app.use(cors());
  app.use(express.json());
  await AppDataSource.initialize();

  app.use('/poi', POIRouter);
  app.use('/auth', AuthRouter);
  app.use('/activity', ActivityRouter);
  app.use('/me', ProfileRouter);
  // app.use('/privacy', PrivacyRouter);

  app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
  });
};

main();
