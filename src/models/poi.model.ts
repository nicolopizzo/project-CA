import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { Point } from 'geojson';

export enum POIType {
  HISTORICAL_BUILDING = 'historical building',
  PARK = 'park',
  THEATER = 'theater',
  MUSEUM = 'museum',
  DEPARTMENT = 'department',
}

@Entity()
export class POI {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: false,
  })
  position: Point;

  @Column({
    type: 'enum',
    enum: POIType,
  })
  type: POIType;

  @Column({ type: 'integer' })
  rank: number;
}
