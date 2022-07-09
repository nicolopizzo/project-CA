import { Request, Response, Router } from 'express';
import { Position } from 'geojson';
import { activityService } from '../services/activity.service';
import { ActivityResponseDTO } from './dto/activity.dto';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const activites: ActivityResponseDTO[] =
    await activityService.getValidActivities();

  res.send(activites);
});

router.get('/user', async (req: Request, res: Response) => {
  const activites: Position[] = await activityService.getValidUserPositions();

  res.send(activites);
});

router.get('/zone', async (req: Request, res: Response) => {
  const data = await activityService.groupActivities();
  res.send(data);
});

router.get('/clustering', async (req: Request, res: Response) => {
  let { start, end } = req.query as {
    start: string;
    end: string;
  };

  const startDate = new Date(start);
  const endDate = new Date(end);

  const data = await activityService.clusterUsers(startDate, endDate);
  res.send(data);
});

export { router as ActivityRouter };
