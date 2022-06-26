import { type } from 'os';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { POI } from './poi.model';

@Entity()
export class User {
  @PrimaryColumn()
  username: string;

  @Column({ nullable: false })
  password: string;

  // @Column({ type: 'int', array: true })
  // pois: number[]; // id of pois
}
