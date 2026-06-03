import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

import { Auditable } from './auditable.entity';

@Entity('leads')
export class Lead extends Auditable {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: true,
  })
  name!: string;

  @Column({
    nullable: true,
  })
  phone!: string;

  @Column({
    nullable: true,
  })
  email!: string;

  @Column({
    name: 'interested_in',
    nullable: true,
  })
  interestedIn!: string;

  @Column({
    name: 'request_type',
    nullable: true,
  })
  requestType!: string;

  @Column({
    nullable: false,
    default: 'PENDING',
  })
  status!: string;
}