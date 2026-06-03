import { Trainer }from '../entity/trainer.entity';

export abstract class TrainerService {

  abstract create(trainer: Trainer,): Promise<Trainer>;

  abstract getById(id: number,): Promise<Trainer>;

  abstract getAll(): Promise<Trainer[]>;

  abstract update(id: number,trainer: Trainer,): Promise<Trainer>;

  abstract delete(id: number,): Promise<void>;

  abstract search(name: string,email: string,specialization: string,minExp: number,page: number,size: number,): Promise<Trainer[]>;

  abstract updateStatus(id: number,status: boolean,): Promise<void>;
}