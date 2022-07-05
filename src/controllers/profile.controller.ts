import { Request, Response, Router } from 'express';
import { profileService } from '../services/profile.service';
import { AddUserPOI } from './dto/profile.dto';

const router = Router();

router.post('/poi', async (req: Request, res: Response) => {
  const info: AddUserPOI = req.body;

  const poiList = await profileService.addPoi(info);
  res.status(200).send(poiList);
});

router.get('/poi/:username', async (req: Request, res: Response) => {
    const username = req.params.username;
  const data = await profileService.getUserPois({username});

  res.status(200).send(data);
});

export { router as ProfileRouter };