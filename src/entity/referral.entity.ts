import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('referral')
export class Referral {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  referrerName!: string;

  @Column({ nullable: false })
  referrerPhone!: string;

  @Column({ nullable: false })
  referredName!: string;

  @Column({ nullable: false })
  referredPhone!: string;

  @Column({ nullable: true })
  interestedIn!: string;

  @Column({ default: 'PENDING' })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;
}