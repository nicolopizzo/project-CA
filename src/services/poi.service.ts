import { POIRequest } from '../controllers/dto/poi.dto';
import { POI } from '../models/poi.model';

const pois: POI[] = [
  {
    id: 'Osteria San P',
    position: {
      latitude: 45.4654,
      longitude: 9.1854,
    },
    type: 'restaurant',
    rank: 6.7,
  },
  {
    id: 'Osteria San Pargiollo',
    position: {
      latitude: 44.652,
      longitude: 11.423,
    },
    type: 'restaurant',
    rank: 6.7,
  },
  {
    id: 'Osteria San Popo',
    position: {
      latitude: 44.658,
      longitude: 11.1254,
    },
    type: 'restaurant',
    rank: 2.3,
  },
];

class POIService {
  // private poiRepository;

  async findOptimalPOI(info: POIRequest): Promise<POI[]> {
    const { latitude, longitude } = info.position;
    const poisRankFiltered = pois.filter((poi) => poi.rank >= info.minRank);
    const nearPois = poisRankFiltered.map((poi) =>
      Math.sqrt(
        Math.pow(latitude - poi.position.latitude, 2) +
          Math.pow(longitude - poi.position.longitude, 2)
      )
    );

    const minDistance = Math.min(...nearPois);
    let poisNear = [];
    for (let i = 0; i < nearPois.length; i++) {
      if (nearPois[i] === minDistance) {
        poisNear.push(poisRankFiltered[i]);
      }
    }

    return poisNear;
  }
}

export const poiService = new POIService();
