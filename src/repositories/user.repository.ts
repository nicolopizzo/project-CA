import { Repository } from 'typeorm';
import { AppDataSource } from '../datasource';
import { User } from '../models/user.model';

// const db: User[] = [
//   {
//     username: 'mariorossi',
//     password: '1234',
//     pois: [
//       {
//         name: 'Osteria San P',
//         position: {
//           latitude: 45.4654,
//           longitude: 9.1854,
//         },
//         type: 'restaurant',
//         rank: 6.7,
//       },
//     ],
//   },
// ];

export const UserRepository = AppDataSource.getRepository(User);
