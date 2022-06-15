import { POI } from '../../models/poi.model';
import { Position } from '../../models/position.model';

export class POIRequest {
  minRank: number;
  type: string;
  positions: Position[];
}

export class CreatePOIRequest {
  rank: number;
  type: string;
  position: Position;
  id: string;
}

export class POIResponse {
  items: POIItem[];
}

export class POIItem {
  position: Position;
  poi: POI;
}

export class UpdatePOIRequest {
  rank: number;
}
