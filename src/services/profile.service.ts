import {
  AddUserPOI,
  UserPOIRequest,
  UserPOIResponse,
} from '../controllers/dto/profile.dto';
import { User } from '../models/user.model';
import { POIRepository } from '../repositories/poi.repository';
import { UserRepository } from '../repositories/user.repository';

class ProfileService {
  public async getUserPois(info: UserPOIRequest): Promise<UserPOIResponse> {
    let returnedPois: UserPOIResponse = { POIs: [] };

    let username = info.username;
    const foundUser: User | null = await UserRepository.findOneBy({ username });
    let POIIdList = foundUser?.pois;
    const poi = await POIRepository.createQueryBuilder('poi')
      .select(['poi'])
      .where(`poi.id IN (:pois)`, { pois: POIIdList });

    return returnedPois;
  }

  public async addPoi(info: AddUserPOI): Promise<UserPOIResponse> {
    let returnedPois: UserPOIResponse = { POIs: [] };

    let username = info.username;
    const foundUser: User | null = await UserRepository.findOneBy({ username });
    if (foundUser) {
      let returnedPois = foundUser.pois;
      let id = info.poi.id;

      returnedPois.push(id);

      await UserRepository.update(returnedPois, foundUser);
    }

    return returnedPois;
  }
}

export const profileService = new ProfileService();
