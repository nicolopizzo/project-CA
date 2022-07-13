import { Point, Position } from 'geojson';
import {
  ActivityClusterResponseDTO,
  ActivityResponseDTO,
  ActivityZoneResponseDTO,
  fromActivity,
} from '../controllers/dto/activity.dto';
import { ActivityRepository } from '../repositories/activity.repository';
import { neighborhoods } from '../utils/area.util';

type Cluster = {
  points: Point[];
  centroid: Point;
};

const invert = (pos: number[]) => [pos[1], pos[0]];

const toClause = (startTime: Date, endTime: Date): string => {
  return `activity.timestamp BETWEEN '${startTime.toISOString()}' AND '${endTime.toISOString()}'`;
};

class ActivityService {
  public async getValidActivities(): Promise<ActivityResponseDTO[]> {
    // const activities = await ActivityRepository.find();
    const activities = await ActivityRepository.createQueryBuilder('activity')
      .where('activity.expires > NOW()')
      .getMany();

    return activities.map(fromActivity);
  }

  public async getValidUserPositions(): Promise<Position[]> {
    const activities = await ActivityRepository.createQueryBuilder('activity')
      .where('activity.expires > NOW()')
      .getMany();
    return activities.map((a) => invert(a.userPosition.coordinates));
  }

  public async groupActivities(): Promise<ActivityZoneResponseDTO> {
    const groupedZones: ActivityZoneResponseDTO = [];

    for (let area of neighborhoods) {
      const polygon = JSON.stringify(area.coordinates);
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

      groupedZones.push({ area: area.coordinates, count: activities });
    }

    return groupedZones;
  }

  public async clusterUsers(
    startTime: Date,
    endTime: Date
  ): Promise<ActivityClusterResponseDTO | undefined> {
    const clusters = await this.elbowMethod(startTime, endTime);
    return clusters?.map((c) => ({
      count: c.points.length,
      centroid: c.centroid.coordinates,
    }));
  }

  private async groupUsers(
    k: number,
    startTime: Date,
    endTime: Date
  ): Promise<Cluster[] | undefined> {
    let intervalClause = toClause(startTime, endTime);

    const grouped = await ActivityRepository.createQueryBuilder('activity')
      .select([
        `activity.userPosition`,
        `st_clusterkmeans(activity.userPosition, ${k}) over () as cid`,
      ])
      .where(intervalClause)
      .getRawMany();

    let clusters: Point[][] = [];
    for (let i = 0; i < k; i++) {
      clusters.push([]);
    }

    for (let touple of grouped) {
      const { activity_userPosition, cid } = touple;

      clusters[cid].push(activity_userPosition);
    }

    return clusters.map((c) => ({ points: c, centroid: this.centroid(c) }));
  }

  private async elbowMethod(
    startTime: Date,
    endTime: Date
  ): Promise<Cluster[] | undefined> {
    let intervalClause = toClause(startTime, endTime);
    const activitiesCount = await ActivityRepository.createQueryBuilder(
      'activity'
    )
      .where(intervalClause)
      .getCount();
    const kMin = Math.min(activitiesCount, 6);
    const kMax = Math.min(activitiesCount, 12);

    let distortions = [];
    for (let k = kMin; k <= kMax; k++) {
      const clusters = await this.groupUsers(k, startTime, endTime);
      if (clusters === undefined) {
        return;
      }

      distortions.push(this.avgDistortion(clusters));
    }

    const k1 = distortions.length - 1;
    // find where distortion decreases linearly
    for (let k = kMin; k < kMax; k++) {
      const k0 = k - kMin;
      const dy = distortions[k1] - distortions[k0];
      const dx = kMax - k;
      const x0 = k;
      const y0 = distortions[k0];
      const x = k + 1;

      const m = dy / dx;

      // prossimo valore se si ha decrescenza lineare
      const predNext = (m * x - m * x0 + y0) / 1000;
      // prossimo valore reale
      const next = distortions[k0 + 1] / 1000;
      const err = Math.abs(predNext - next);

      // Imposto un errore di +/- 0.07
      if (err < 0.07) {
        return await this.groupUsers(k, startTime, endTime);
      }
    }

    return await this.groupUsers(kMax, startTime, endTime);
  }

  private avgDistortion(clusters: Cluster[]): number {
    return (
      clusters
        .map((c) => this.distortion(c.points, c.centroid))
        .reduce((a, b) => a + b, 0) / clusters.length
    );
  }

  private distortion(points: Point[], centroid: Point): number {
    const d = points
      .map((p) => {
        const x = p.coordinates[0];
        const y = p.coordinates[1];
        const xc = centroid.coordinates[0];
        const yc = centroid.coordinates[1];
        return Math.sqrt((x - xc) ** 2 + (y - yc) ** 2);
      })
      .reduce((a, b) => a + b, 0);
    return d;
  }

  private centroid(points: Point[]): Point {
    const x = points.map((p) => p.coordinates[0]);
    const y = points.map((p) => p.coordinates[1]);
    const xMean = x.reduce((a, b) => a + b, 0) / x.length;
    const yMean = y.reduce((a, b) => a + b, 0) / y.length;
    return { type: 'Point', coordinates: [yMean, xMean] };
  }
}

export const activityService = new ActivityService();
