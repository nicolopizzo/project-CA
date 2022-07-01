import { Position } from 'geojson';
import { Activity } from '../../models/activity.model';
import { IPosition } from '../../models/position.model';

export interface ActivityResponseDTO {
  poiPosition: IPosition;
  userPosition: IPosition;
  timestamp: Date;
  expires: Date;
}

export const fromActivity = (a: Activity): ActivityResponseDTO => {
  const [longitude, latitude] = a.poiPosition.coordinates;
  return {
    poiPosition: { latitude, longitude },
    userPosition: { latitude, longitude },
    timestamp: a.timestamp,
    expires: a.expires,
  };
};

interface ActivityZone {
  area: number[][];
  count: number;
}

export type ActivityZoneResponseDTO = ActivityZone[];

interface ClusterDTO {
  centroid: Position;
  count: number;
}

export type ActivityClusterResponseDTO = ClusterDTO[];
