import { Trainer } from '../entity/trainer.entity';

export abstract class TrainerRepository {

  abstract save(trainer: Trainer): Promise<Trainer>;

  abstract delete(trainer: Trainer): Promise<void>;

  abstract findById(id: number): Promise<Trainer | null>;

  abstract findAll(page: number, size: number): Promise<{
    data: Trainer[];
    total: number;
  }>;

  abstract findByEmail(email: string): Promise<Trainer | null>;

  abstract findByStatusTrue(): Promise<Trainer[]>;

  abstract existsByNameAndCourseName(
    name: string,
    courseName: string,
  ): Promise<boolean>;

  abstract findByNameContainingIgnoreCase(name: string): Promise<Trainer[]>;

  abstract findByNameContainingIgnoreCaseAndStatusTrue(
    name: string,
  ): Promise<Trainer[]>;

  abstract findBySpecializationContainingIgnoreCaseAndStatusTrue(
    specialization: string,
  ): Promise<Trainer[]>;

  abstract searchBySpecialization(specialization: string): Promise<Trainer[]>;

  abstract findAllExperiences(): Promise<number[]>;

  abstract search(
    nameFilter: any,
    emailFilter: any,
    specializationFilter: any,
    minExpFilter: any,
    page: number,
    size: number,
  ): Promise<{
    data: Trainer[];
    total: number;
  }>;
}