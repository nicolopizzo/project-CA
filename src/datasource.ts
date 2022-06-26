import { DataSource } from 'typeorm';
import { POI } from './models/poi.model';
import { User } from './models/user.model';

export const AppDataSource = new DataSource({
  database: 'test_poi',
  username: 'test',
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  password: 'test',
  synchronize: true,
  // logging: false,
  entities: [POI, User],
  // dropSchema: true,
});
