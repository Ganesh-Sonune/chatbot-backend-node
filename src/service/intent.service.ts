import { Intent }from '../entity/intent.entity';

export abstract class IntentService {

  abstract create(intent: Intent,): Promise<Intent>;

  abstract getById(id: number,): Promise<Intent>;

  abstract getAll(page: number,size: number,): Promise<Intent[]>;

  abstract update(id: number,intent: Intent,): Promise<Intent>;

  abstract delete(id: number,): Promise<void>;

  abstract updateStatus(id: number,status: boolean,): Promise<void>;
}