import { Request, Response, Router } from 'express';
import { privacyService } from '../services/privacy.service';

const router = Router();

router.get('/cloaking', async (req: Request, res: Response) => {
  const info = req.body;
  const { positions } = info;

  const clusters = privacyService.spatialCloaking(positions);
  res.status(200).send(clusters);
});

export { router as PrivacyRouter };
