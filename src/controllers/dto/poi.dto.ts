import { POI } from '../../models/poi.model';
import { Position } from '../../models/position.model';

export class POIRequest {
  position: Position;
  minRank: number;
  type: string;
  privacySettings: any;
}

export class POIResponse {
  pois: POI[];
}
