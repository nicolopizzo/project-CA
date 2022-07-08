import { fromPOI } from '../controllers/dto/poi.dto';
import { In } from 'typeorm';
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

    const pois = await POIRepository.findBy({
      id: In(POIIdList ? POIIdList : []),
    });
    pois.map((poi) => {
      returnedPois.POIs.push(poi);
    });

    return returnedPois;
  }

  public async addPoi(info: AddUserPOI): Promise<UserPOIResponse> {
    let username = info.username;
    const foundUser: User | null = await UserRepository.findOneBy({ username });
    if (foundUser != null) {
      let id = info.poi.id;

      if (foundUser.pois.indexOf(id) == -1) {
        foundUser.pois.push(id);
        await UserRepository.save(foundUser);
      } else {
        foundUser.pois.splice(foundUser.pois.indexOf(id), 1);
        await UserRepository.save(foundUser);
      }
    }

    return this.getUserPois({ username });
  }
}

export const profileService = new ProfileService();
