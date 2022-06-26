import { Point } from 'geojson';
import { POI, POIType } from '../../models/poi.model';
import { IPosition } from '../../models/position.model';

export class OptimalPOIRequestDTO {
  minRank: number;
  type: POIType;
  positions: IPosition[];
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

export class POIResponseDTO {
  items: POIItemDTO[];
}

export class POIItemDTO {
  position: IPosition;
  poi: POI;
}

export class UpdatePOIRequestDTO {
  rank: number;
}
