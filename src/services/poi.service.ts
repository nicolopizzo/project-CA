import { Point } from 'geojson';
import { MoreThanOrEqual } from 'typeorm';
import {
  CreatePOIRequestDTO,
  POIItemDTO,
  OptimalPOIRequestDTO,
  POIResponseDTO,
  CreatePOIDto,
} from '../controllers/dto/poi.dto';
import { POI } from '../models/poi.model';
import { IPosition } from '../models/position.model';
import { POIRepository } from '../repositories/poi.repository';

class POIService {
  public async findOptimalPOI(
    info: OptimalPOIRequestDTO
  ): Promise<POIResponseDTO> {
    const poisFiltered: POI[] = await POIRepository.find({
      where: {
        rank: MoreThanOrEqual(info.minRank),
        type: info.type,
      },
    });

    let returnedPois: POIResponseDTO = { items: [] };
    if (poisFiltered.length <= 0) {
      // TODO: return request unfullfillable
      return returnedPois;
    }

    for (let pos of info.positions) {
      let item: POIItemDTO = { position: pos, poi: poisFiltered[0] };
      let minDistance = Number.MAX_VALUE;

      for (let poi of poisFiltered) {
        const [longitude, latitude] = poi.position.coordinates;
        const distance = harvesineDistance(pos, { latitude, longitude });

        if (distance < minDistance) {
          minDistance = distance;
          item.poi = poi;
        }
      }

      returnedPois.items.push(item);
    }

    return returnedPois;
  }

  public async create(info: CreatePOIRequestDTO): Promise<POI | undefined> {
    const position: Point = {
      type: 'Point',
      coordinates: [info.position.longitude, info.position.latitude],
    };

    const poi: CreatePOIDto = {
      name: info.name,
      position: position,
      rank: info.rank,
      type: info.type,
    };

    return POIRepository.save(poi);
  }

  async findAll(): Promise<POI[]> {
    return POIRepository.find();
  }

  // async updatePOI(id: string, rank: number): Promise<POI | undefined> {
  //   const foundPOI = await poiRepository.findById(id);
  //   if (foundPOI == undefined) {
  //     console.log(foundPOI);

  //     return undefined;
  //   }

  //   foundPOI.rank = rank;
  //   const updatedPOI = await poiRepository.update(id, foundPOI);

  //   return updatedPOI;
  // }
}

const harvesineDistance = (p1: IPosition, p2: IPosition): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(p2.latitude - p1.latitude); // deg2rad below
  const dLon = deg2rad(p2.longitude - p1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(p1.latitude)) *
      Math.cos(deg2rad(p2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (d: number): number => (d * Math.PI) / 180;

export const poiService = new POIService();
