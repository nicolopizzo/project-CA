import { Request, Response, Router } from 'express';
import { poiService } from '../services/poi.service';
import { CreatePOIRequest, POIRequest } from './dto/poi.dto';

const router = Router();

router.get('/optimal', async (req: Request, res: Response) => {
  const info: POIRequest = req.body;

  // console.log(req.body);
  const poiFound = await poiService.findOptimalPOI(info);
  res.status(200).send(poiFound);
});

router.get('/', async (req: Request, res: Response) => {
  const poiFound = await poiService.findAll();

  res.status(200).send(poiFound);
});

router.put('/', async (req: Request, res: Response) => {
  const info: CreatePOIRequest = req.body;
  const poi = await poiService.addPOI(info);

  if (poi == undefined) {
    res
      .status(400)
      .send(`Bad request: POI with id "${info.id}" already exists`);
  }

  res.status(201).send(poi);
});

router.post('/update', async (req: Request, res: Response) => {
  const { id, rank } = req.body;

  const updatedPOI = await poiService.updatePOI(id, rank);
  if (updatedPOI == undefined) {
    res.status(404).send(`POI with id "${id}" not found`);
  }

  res.status(200).send(updatedPOI);
});

export { router as POIRouter };
