import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn
} from 'typeorm';

@Entity('admin_activity')
export class AdminActivity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  admin_id: number;

  @Column()
  action: string;

  @Column('text')
  description: string;

  @CreateDateColumn()
  created_at: Date;



}