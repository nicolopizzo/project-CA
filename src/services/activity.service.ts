import {
  ActivityResponseDTO,
  ActivityZoneResponseDTO,
  fromActivity,
} from '../controllers/dto/activity.dto';
import { ActivityRepository } from '../repositories/activity.repository';
import { neighbors } from '../utils/area.util';

class ActivityService {
  public async getValidActivities(): Promise<ActivityResponseDTO[]> {
    const activities = await ActivityRepository.createQueryBuilder('activity')
      .select()
      .where('activity.expires > NOW()')
      .getMany();

    return activities.map(fromActivity);
  }

  public async groupActivities(): Promise<ActivityZoneResponseDTO> {
    const groupedZones: ActivityZoneResponseDTO = [];
    for (let area of neighbors) {
      const polygon = JSON.stringify(area);
      const withinClause =
        `ST_Within(activity.poiPosition, 
          st_geomfromgeojson( 
            '{ "type": "Polygon", "coordinates": [` +
        polygon +
        `]}'))`;

      const activities = await ActivityRepository.createQueryBuilder('activity')
        .select()
        .where('activity.expires > NOW()')
        .andWhere(withinClause)
        .getCount();

      groupedZones.push({ area: area, count: activities });
    }

    return groupedZones;
  }
}

export const activityService = new ActivityService();
