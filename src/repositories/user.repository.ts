import { AppDataSource } from '../datasource';
import { User } from '../models/user.model';

export const UserRepository = AppDataSource.getRepository(User);
