import { POI } from '../models/poi.model';

const db: POI[] = [
	{
      id: "Tamburini",
      position: {latitude: 44.4937354, longitude: 11.3454177},
      type: "restaurant",
      rank: 7.8,
    },
    {
      id: "Giardini Margherita",
      position: {latitude: 44.4822181, longitude: 11.3526779},
      type: "green",
      rank: 6.5,
    },
    {
      id: "Piazza Maggiore",
      position: {latitude: 44.49364306741059, longitude: 11.3429425701172},
      type: "green",
      rank: 8.9,
    },
];

class POIRepository {
  async find(): Promise<POI[]> {
    return db;
  }

  async save(poi: POI): Promise<POI | undefined> {
    for (let i = 0; i < db.length; i++) {
      if (db[i].id === poi.id) {
        return undefined;
      }
    }

    db.push(poi);
    return poi;
  }

  async findById(id: string): Promise<POI | undefined> {
    return db.find((poi) => poi.id === id);
  }

  async update(id: string, poi: POI): Promise<POI | undefined> {
    const index = db.findIndex((p) => p.id === id);
    if (index === -1) {
      return undefined;
    }

    db[index] = poi;
    return poi;
  }
}

export const poiRepository = new POIRepository();
