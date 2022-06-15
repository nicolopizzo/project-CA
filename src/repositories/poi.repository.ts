import { POI } from '../models/poi.model';

const db: POI[] = [
  {
    id: 'Osteria San P',
    position: {
      latitude: 45.4654,
      longitude: 9.1854,
    },
    type: 'restaurant',
    rank: 6.7,
  },
  {
    id: 'Osteria San Pargiollo',
    position: {
      latitude: 44.652,
      longitude: 11.423,
    },
    type: 'restaurant',
    rank: 6.7,
  },
  {
    id: 'Osteria San Popo',
    position: {
      latitude: 44.658,
      longitude: 11.1254,
    },
    type: 'restaurant',
    rank: 2.3,
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
