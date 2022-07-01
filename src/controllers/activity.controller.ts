import { Request, Response, Router } from 'express';
import { activityService } from '../services/activity.service';
import { ActivityResponseDTO } from './dto/activity.dto';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const activites: ActivityResponseDTO[] =
    await activityService.getValidActivities();

  res.send(activites);
});

router.get('/zone', async (req: Request, res: Response) => {
  const data = await activityService.groupActivities();
  res.send(data);
});

router.get('/users', async (req: Request, res: Response) => {
  const data = await activityService.getUserPositions();
  res.send(data);
});

export { router as ActivityRouter };
