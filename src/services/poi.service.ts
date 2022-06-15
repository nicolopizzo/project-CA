import {
  CreatePOIRequest,
  POIItem,
  POIRequest,
  POIResponse,
} from '../controllers/dto/poi.dto';
import { POI } from '../models/poi.model';
import { poiRepository } from '../repositories/poi.repository';

class POIService {
  async findOptimalPOI(info: POIRequest): Promise<POIResponse> {
    let returnedPois: POIResponse = { items: [] };
    const poisRankFiltered = (await poiRepository.find()).filter(
      (poi) => poi.rank >= info.minRank
    );

    for (let pos of info.positions) {
      let item = new POIItem();
      const { latitude, longitude } = pos;

      item.position = pos;

      let minDistance = Number.MAX_VALUE;

      for (let i = 0; i < poisRankFiltered.length; i++) {
        const distance = Math.sqrt(
          Math.pow(poisRankFiltered[i].position.latitude - latitude, 2) +
            Math.pow(poisRankFiltered[i].position.longitude - longitude, 2)
        );

        if (distance < minDistance) {
          item.poi = poisRankFiltered[i];
          minDistance = distance;
        }
      }

      returnedPois.items.push(item);
    }

    return returnedPois;
  }

  async addPOI(info: CreatePOIRequest): Promise<POI | undefined> {
    const poi: POI = {
      id: info.id,
      position: info.position,
      rank: info.rank,
      type: info.type,
    };

    const { id } = poi;

    // const savedPOI = await poiRepository.save(poi);

    return poiRepository.save(poi);
  }

  async findAll(): Promise<POI[]> {
    return poiRepository.find();
  }

  async updatePOI(id: string, rank: number): Promise<POI | undefined> {
    const foundPOI = await poiRepository.findById(id);
    if (foundPOI == undefined) {
      console.log(foundPOI);

      return undefined;
    }

    foundPOI.rank = rank;
    const updatedPOI = await poiRepository.update(id, foundPOI);

    return updatedPOI;
  }
}

export const poiService = new POIService();
