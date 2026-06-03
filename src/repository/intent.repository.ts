import { Intent }from '../entity/intent.entity';

export abstract class IntentRepository {

  abstract save(intent: Intent,): Promise<Intent>;

  abstract delete(intent: Intent,): Promise<void>;

  abstract findById(id: number,): Promise<Intent | null>;

  abstract findAll(page: number,size: number,): Promise<Intent[]>;

  abstract findByStatusTrue(): Promise<Intent[]>;

  abstract findByIntentNameIgnoreCase(intentName: string,): Promise<Intent | null>;

  abstract existsByIntentName(intentName: string,): Promise<boolean>;

}