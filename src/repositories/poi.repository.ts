import { AppDataSource } from '../datasource';
import { POI } from '../models/poi.model';

export const POIRepository = AppDataSource.getRepository(POI);
