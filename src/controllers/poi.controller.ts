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

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const poi = await poiService.findById(parseInt(id));
    if (poi === undefined) {
      res.status(404).send(`POI with id "${id}" not found`);
    }

    res.status(200).send(poi);
  } catch (e) {
    res.status(400).send({ msg: 'Bad request, id must be a number' });
  }
});

router.post('/:id', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = parseInt(req.params.id);
    const poi = await poiService.update(id, data);

    if (poi === undefined) {
      res.status(404).send(`POI with id "${id}" not found`);
    }

    res.status(200).send(poi);
  } catch (e) {
    res.status(400).send({ msg: 'Bad request, id must be a number' + e });
  }
});

export { router as POIRouter };
