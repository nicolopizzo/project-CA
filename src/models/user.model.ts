import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'int', array: true })
  pois: number[]; // id of pois
}
