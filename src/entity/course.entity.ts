import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Auditable } from './auditable.entity';

@Entity('courses')
export class Course extends Auditable {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: true })
  duration!: string;

  @Column({ type: 'text', nullable: true })
  skills!: string;

  @Column({ nullable: true })
  mode!: string;

  @Column({ type: 'text', nullable: true })
  highlights!: string;

  @Column({ default: true })
  status!: boolean;

  @Column({ nullable: true })
  batchTiming!: string;

  @Column({ nullable: true })
  nextBatchDate!: string;

  @Column({ nullable: true })
  brochureUrl!: string;
}