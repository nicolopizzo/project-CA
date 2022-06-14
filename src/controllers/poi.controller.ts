import { Request, Response, Router } from 'express';
import { poiService } from '../services/poi.service';
import { POIRequest } from './dto/poi.dto';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const info: POIRequest = req.body;

  const { position, privacySettings } = info;

  // console.log(req.body);
  const poiFound = await poiService.findOptimalPOI(info);
  res.status(200).send(poiFound);
});

export { router as POIRouter };
