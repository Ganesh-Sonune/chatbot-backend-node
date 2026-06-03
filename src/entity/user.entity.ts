import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

import { Role } from '../enums/role.enum';

@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: false,
    unique: true,
  })
  username!: string;

  @Column({
    nullable: false,
  })
  password!: string;

  @Column({
    type: 'enum',
    enum: Role,
    nullable: false,
  })
  role!: Role;

  @Column({
    default: true,
  })
  enabled!: boolean;
}