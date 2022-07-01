import { Point } from 'geojson';
import { POI, POIType } from '../../models/poi.model';
import { IPosition } from '../../models/position.model';

export class OptimalPOIRequestDTO {
  minRank: number;
  type: POIType;
  positions: IPosition[];
}

export type POIZoneDTO = POIZoneItemDTO[];

class POIZoneItemDTO {
  area: number[][];
  count: number;
}

export class CreatePOIRequestDTO {
  rank: number;
  type: POIType;
  position: IPosition;
  name: string;
}

export class CreatePOIDto {
  rank: number;
  type: POIType;
  position: Point;
  name: string;
}

export class OptimalPOIResponseDTO {
  items: POIItemDTO[];
}

export interface POIResponseDTO {
  id: number;
  name: string;
  position: IPosition;
  type: POIType;
  rank: number;
}

export class POIItemDTO {
  position: IPosition;
  poi: POIResponseDTO;
}

export class UpdatePOIRequestDTO {
  rank: number;
}

export const fromPOI = (poi: POI): POIResponseDTO => ({
  id: poi.id,
  name: poi.name,
  position: {
    latitude: poi.position.coordinates[1],
    longitude: poi.position.coordinates[0],
  },
  type: poi.type,
  rank: poi.rank,
});
