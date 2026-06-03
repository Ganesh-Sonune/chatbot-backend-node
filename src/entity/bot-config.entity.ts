import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

import { Auditable }
from './auditable.entity';

@Entity('bot_config')
export class BotConfig
extends Auditable {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: false,
    unique: true,
  })
  configKey!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  configValue!: string;
}