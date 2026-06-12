import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { TrainerRepository } from '../trainer.repository';
import { Trainer } from '../../entity/trainer.entity';

@Injectable()
export class TrainerRepositoryImpl extends TrainerRepository {

  constructor(
    @InjectRepository(Trainer)
    private readonly repo: Repository<Trainer>,
  ) {
    super();
  }

  async save(trainer: Trainer): Promise<Trainer> {
    return await this.repo.save(trainer);
  }

  async delete(trainer: Trainer): Promise<void> {
    await this.repo.remove(trainer);
  }

  async findById(id: number): Promise<Trainer | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findAll(page: number, size: number) {
    const [data, total] = await this.repo.findAndCount({
      skip: page * size,
      take: size,
      order: { id: 'DESC' },
    });

    return { data, total };
  }


  async search(
    nameFilter: any,
    emailFilter: any,
    specializationFilter: any,
    minExpFilter: any,
    page: number,
    size: number,
  ) {
    const query = this.repo.createQueryBuilder('trainer');

    if (nameFilter?.name) {
      query.andWhere('trainer.name LIKE :name', {
        name: `%${nameFilter.name}%`,
      });
    }

    if (emailFilter?.email) {
      query.andWhere('trainer.email LIKE :email', {
        email: `%${emailFilter.email}%`,
      });
    }

    if (specializationFilter?.specialization) {
      query.andWhere('trainer.specialization LIKE :spec', {
        spec: `%${specializationFilter.specialization}%`,
      });
    }

    if (minExpFilter?.experience) {
      query.andWhere('trainer.experience >= :exp', {
        exp: minExpFilter.experience,
      });
    }

    const [data, total] = await query
      .where('trainer.status = :status', { status: true })
      .orderBy('trainer.id', 'DESC')
      .skip(page * size)
      .take(size)
      .getManyAndCount();

    return { data, total };
  }


  async findByEmail(email: string): Promise<Trainer | null> {
    return await this.repo.findOne({ where: { email } });
  }

  async findByStatusTrue(): Promise<Trainer[]> {
    return await this.repo.find({ where: { status: true } });
  }

  async existsByNameAndCourseName(
    name: string,
    courseName: string,
  ): Promise<boolean> {
    const count = await this.repo.count({
      where: { name, courseName },
    });
    return count > 0;
  }

  async findByNameContainingIgnoreCase(name: string): Promise<Trainer[]> {
    return this.repo.find({
      where: { name: ILike(`%${name}%`) },
    });
  }

  async findByNameContainingIgnoreCaseAndStatusTrue(
    name: string,
  ): Promise<Trainer[]> {
    return this.repo.find({
      where: {
        name: ILike(`%${name}%`),
        status: true,
      },
    });
  }

  async findBySpecializationContainingIgnoreCaseAndStatusTrue(
    specialization: string,
  ): Promise<Trainer[]> {
    return this.repo.find({
      where: {
        specialization: ILike(`%${specialization}%`),
        status: true,
      },
    });
  }

  async searchBySpecialization(
    specialization: string,
  ): Promise<Trainer[]> {
    return this.repo.find({
      where: {
        specialization: ILike(`%${specialization}%`),
        status: true,
      },
    });
  }

  async findAllExperiences(): Promise<number[]> {
    const result = await this.repo.find({
      select: { experience: true },
      where: { status: true },
    });

    return result.map((t) => t.experience);
  }
}