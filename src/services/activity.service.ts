import { Point } from 'geojson';
import {
  ActivityClusterResponseDTO,
  ActivityResponseDTO,
  ActivityZoneResponseDTO,
  fromActivity,
} from '../controllers/dto/activity.dto';
import { ActivityRepository } from '../repositories/activity.repository';
import { neighborhoods } from '../utils/area.util';

class ActivityService {
  public async getValidActivities(): Promise<ActivityResponseDTO[]> {
    // const activities = await ActivityRepository.find();
    const activities = await ActivityRepository.createQueryBuilder('activity')
      .where('activity.expires > NOW()')
      .getMany();

    return activities.map(fromActivity);
  }

  public async groupActivities(): Promise<ActivityZoneResponseDTO> {
    const groupedZones: ActivityZoneResponseDTO = [];

    for (let area of neighborhoods) {
      const polygon = JSON.stringify(area);
      const withinClause =
        `ST_Within(activity.poiPosition, 
            st_geomfromgeojson( 
              '{ "type": "Polygon", "coordinates": [` +
        polygon +
        `]}'))`;

      const activities = await ActivityRepository.createQueryBuilder('activity')
        .select()
        .where(withinClause)
        .andWhere('activity.expires > NOW()')
        .getCount();

      groupedZones.push({ area: area, count: activities });
    }

    return groupedZones;
  }

  public async getUserPositions(): Promise<
    ActivityClusterResponseDTO | undefined
  > {
    let k = 2;
    try {
      // TODO: where clause for temporal window
      const grouped = await ActivityRepository.createQueryBuilder('activity')
        .select([
          `activity.userPosition`,
          `st_clusterkmeans(activity.userPosition, ${k}) over () as cid`,
        ])
        // .where()
        .getRawMany();

      let clusters: Point[][] = [];
      for (let i = 0; i < k; i++) {
        clusters.push([]);
      }

      for (let touple of grouped) {
        const { activity_userPosition, cid } = touple;

        clusters[cid].push(activity_userPosition);
      }

      const resClusters: ActivityClusterResponseDTO = clusters.map((ps) => ({
        count: ps.length,
        centroid: this.centroid(ps).coordinates,
      }));

      return resClusters;
    } catch (error) {
      return undefined;
    }
  }

  //TODO: implement elbow method to find the best k

  private centroid(points: Point[]): Point {
    const x = points.map((p) => p.coordinates[0]);
    const y = points.map((p) => p.coordinates[1]);
    const xMean = x.reduce((a, b) => a + b, 0) / x.length;
    const yMean = y.reduce((a, b) => a + b, 0) / y.length;
    return { type: 'Point', coordinates: [yMean, xMean] };
  }
}

export const activityService = new ActivityService();
