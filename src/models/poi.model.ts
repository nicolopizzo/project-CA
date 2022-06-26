import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { Point } from 'geojson';

export enum POIType {
  BAR = 'bar',
  RESTAURANT = 'restaurant',
  GREENAREA = 'greenarea',
  MUSEUM = 'museum',
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
    default: POIType.RESTAURANT,
  })
  type: POIType;

  @Column({ type: 'integer' })
  rank: number;
}
