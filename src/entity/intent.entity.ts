import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

import { Auditable } from './auditable.entity';

@Entity('intents')
export class Intent extends Auditable {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: false,
    unique: true,
  })
  intentName!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  keywords!: string;

  @Column({
    nullable: false,
  })
  actionType!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  responseTemplate!: string;

  @Column({
    default: true,
  })
  status!: boolean;
}