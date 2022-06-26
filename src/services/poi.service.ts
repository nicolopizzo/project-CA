import { Point } from 'geojson';
import {
  CreatePOIRequestDTO,
  OptimalPOIRequestDTO,
  OptimalPOIResponseDTO,
  CreatePOIDto,
  POIZoneDTO,
  fromPOI,
} from '../controllers/dto/poi.dto';
import { POI } from '../models/poi.model';
import { IPosition } from '../models/position.model';
import { POIRepository } from '../repositories/poi.repository';
import { neighbors } from '../utils/area.util';

class POIService {
  public async findOptimalPOI(
    info: OptimalPOIRequestDTO
  ): Promise<OptimalPOIResponseDTO> {
    let returnedPois: OptimalPOIResponseDTO = { items: [] };

    const formattedType = `'${info.type}'::public."poi_type_enum"`;
    for (let position of info.positions) {
      const { latitude, longitude } = position;

      // true permette di considerare la distanza sferica tra i due punti.
      // Se non lo si esplicita la distanza è proiettata sul piano.
      // Configuro l'SRID su 4326 in modo da invididuare le coordinate come longitudine e latitudine.
      const orderBy = `ST_Distance(poi.position, ST_SetSRID(ST_Point(${longitude}, ${latitude}), 4326), true)`;

      const poi = await POIRepository.createQueryBuilder('poi')
        .select(['poi'])
        .where(`poi.rank > ${info.minRank}`)
        .andWhere(`poi.type = ${formattedType}`)
        .orderBy(orderBy)
        .getOne();

      if (poi) {
        const responsePoi = fromPOI(poi);
        returnedPois.items.push({ poi: responsePoi, position });
      }
    }

    return returnedPois;
  }

  public async groupByZone(): Promise<POIZoneDTO> {
    let areas: POIZoneDTO = [];

    for (let area of neighbors) {
      const polygon = JSON.stringify(area);

      const whereClause =
        `ST_Within(poi.position, 
          st_geomfromgeojson( 
            '{ "type": "Polygon", "coordinates": [` +
        polygon +
        `]}'))`;

      // Query the positions inside the area
      const poisCount: number = await POIRepository.createQueryBuilder('poi')
        .select()
        .where(whereClause)
        .getCount();

      areas.push({ area: area, count: poisCount });
    }

    return areas;
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

export const poiService = new POIService();
