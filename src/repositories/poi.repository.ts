import { EntityRepository, Repository } from 'typeorm';
import { AppDataSource } from '../datasource';
import { POI } from '../models/poi.model';

// const db: POI[] = [
//   {
//     id: 1,
//     name: 'Tamburini',
//     position: { type: 'Point', coordinates: [44.4937354, 11.3454177] },
//     type: 'restaurant',
//     rank: 7.8,
//   },
//   {
//     name: 'Giardini Margherita',
//     position: { latitude: 44.4822181, longitude: 11.3526779 },
//     type: 'green',
//     rank: 6.5,
//   },
//   {
//     name: 'Piazza Maggiore',
//     position: { latitude: 44.49364306741059, longitude: 11.3429425701172 },
//     type: 'green',
//     rank: 8.9,
//   },
// ];

// @EntityRepository(POI)
// export class POIRepository extends Repository<POI> {}
export const POIRepository = AppDataSource.getRepository(POI);

// export const poiRepository = new POIRepository();
