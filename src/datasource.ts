import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  database: 'test_poi',
  username: 'test',
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  //   password: 'test',
  synchronize: true,
  // logging: false,
  // entities: [POI, Position],
});
