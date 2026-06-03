import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Auditable } from './auditable.entity';

@Entity('faq_entries')
export class FaqEntry extends Auditable {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  question!: string;

  @Column({ type: 'text', nullable: true })
  answer!: string;

  @Column({ default: true })
  status!: boolean;
}