import { Request, Response, Router } from 'express';
import { poiService } from '../services/poi.service';
import { CreatePOIRequestDTO, OptimalPOIRequestDTO } from './dto/poi.dto';

const router = Router();

router.post('/optimal', async (req: Request, res: Response) => {
  const info: OptimalPOIRequestDTO = req.body;

  const poiFound = await poiService.findOptimalPOI(info);
  res.status(200).send(poiFound);
});

router.get('/zone', async (req: Request, res: Response) => {
  const data = await poiService.groupByZone();

  res.send(data);
});

router.get('/', async (req: Request, res: Response) => {
  const poiFound = await poiService.findAll();

  res.status(200).send(poiFound);
});

router.put('/', async (req: Request, res: Response) => {
  const info: CreatePOIRequestDTO = req.body;
  const poi = await poiService.create(info);

  if (poi == undefined) {
    res
      .status(400)
      .send(`Bad request: POI with id "${info.name}" already exists`);
  }

  res.status(201).send(poi);
});

router.post('/update', async (req: Request, res: Response) => {
  const { id, rank } = req.body;

  // const updatedPOI = await poiService.updatePOI(id, rank);
  // if (updatedPOI == undefined) {
  //   res.status(404).send(`POI with id "${id}" not found`);
  // }

  res.status(200).send({});
});

export { router as POIRouter };
