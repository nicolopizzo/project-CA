import { Point } from 'geojson';
import {
  CreatePOIRequestDTO,
  OptimalPOIRequestDTO,
  OptimalPOIResponseDTO,
  CreatePOIDto,
  POIZoneDTO,
  fromPOI,
  UpdatePOIDto,
} from '../controllers/dto/poi.dto';
import { Activity } from '../models/activity.model';
import { POI } from '../models/poi.model';
import { ActivityRepository } from '../repositories/activity.repository';
import { POIRepository } from '../repositories/poi.repository';
import { neighborhoods } from '../utils/area.util';

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
        .andWhere(`poi.active = true`) // Restituisco solo i POI abilitati dall'amministratore
        .orderBy(orderBy)
        .getOne();

      if (poi) {
        const responsePoi = fromPOI(poi);
        returnedPois.items.push({ poi: responsePoi, position });

        // Save activity for admin frontend heatmap
        const timestamp = new Date();
        // expires in 5 minutes
        const expires = new Date(timestamp.getTime() + 300000);
        const activity: Partial<Activity> = {
          userPosition: { type: 'Point', coordinates: [longitude, latitude] },
          poiPosition: poi.position,
          timestamp,
          expires,
        };

        await ActivityRepository.save(activity);
      }
    }

    return returnedPois;
  }

  public async groupByZone(): Promise<POIZoneDTO> {
    let areas: POIZoneDTO = [];

    for (let area of neighborhoods) {
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
        .andWhere(`poi.active = true`)
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

  async enable(id: number): Promise<POI | undefined> {
    const foundPOI = await POIRepository.findOneBy({ id });
    if (foundPOI === null) {
      return undefined;
    }

    foundPOI.active = true;
    return POIRepository.save(foundPOI);
  }

  async disable(id: number): Promise<POI | undefined> {
    const foundPOI = await POIRepository.findOneBy({ id });
    if (foundPOI === null) {
      return undefined;
    }

    foundPOI.active = false;
    return POIRepository.save(foundPOI);
  }

  async update(id: number, poi: UpdatePOIDto): Promise<POI | undefined> {
    const foundPOI = await POIRepository.findOneBy({ id });
    if (foundPOI === null) {
      return undefined;
    }

    const updatedPOI = await POIRepository.save({ id, ...poi });

    return updatedPOI;
  }

  async findById(id: number): Promise<POI | undefined> {
    const poi = await POIRepository.findOneBy({ id });
    if (poi === null) {
      return undefined;
    }

    return poi;
  }
}

export const poiService = new POIService();
