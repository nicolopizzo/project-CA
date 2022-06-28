import { Request, Response, Router } from 'express';
import { activityService } from '../services/activity.service';
import { authService } from '../services/auth.service';
import { ActivityResponseDTO } from './dto/activity.dto';
import { LoginRequestDTO, SignupRequestDTO } from './dto/auth.dto';

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

export { router as ActivityRouter };
