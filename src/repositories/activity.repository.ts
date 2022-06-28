import { AppDataSource } from '../datasource';
import { Activity } from '../models/activity.model';

export const ActivityRepository = AppDataSource.getRepository(Activity);
