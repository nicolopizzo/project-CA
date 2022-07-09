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
  const { interval } = req.query as { interval: string };
  const data = await activityService.clusterUsers(interval);
  res.send(data);
});

export { router as ActivityRouter };
