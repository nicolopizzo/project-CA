import { Activity } from '../../models/activity.model';
import { IPosition } from '../../models/position.model';

export interface ActivityResponseDTO {
  position: IPosition;
  timestamp: Date;
  expires: Date;
}

export const fromActivity = (a: Activity): ActivityResponseDTO => {
  const [longitude, latitude] = a.poiPosition.coordinates;
  return {
    position: { latitude, longitude },
    timestamp: a.timestamp,
    expires: a.expires,
  };
};

interface ActivityZone {
  area: number[][];
  count: number;
}

export type ActivityZoneResponseDTO = ActivityZone[];
