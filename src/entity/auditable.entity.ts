import { BeforeInsert, BeforeUpdate, Column } from 'typeorm';

export abstract class Auditable {
  @Column({ nullable: true })
  createdAt!: Date;

  @Column({ nullable: true })
  updatedAt!: Date;

  @Column({ nullable: true })
  createdBy!: string;

  @Column({ nullable: true })
  updatedBy!: string;

  @BeforeInsert()
  onCreate() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  onUpdate() {
    this.updatedAt = new Date();
  }
}