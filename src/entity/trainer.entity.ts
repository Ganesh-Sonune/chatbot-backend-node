import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

import { Auditable }
from './auditable.entity';

@Entity('trainers')
export class Trainer
extends Auditable {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: false,
  })
  name!: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email!: string;

  @Column({
    length: 10,
    nullable: true,
  })
  phone!: string;

  @Column({
    default: 0,
  })
  experience!: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  specialization!: string;

  @Column({
    nullable: true,
  })
  courseName!: string;

  @Column({
    default: true,
  })
  status!: boolean;
}