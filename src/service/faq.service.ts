import { FaqEntry }from '../entity/faq-entry.entity';

export abstract class FaqService {

  abstract create(entity: FaqEntry,): Promise<FaqEntry>;

  abstract getById(id: number,): Promise<FaqEntry>;

  abstract getAll(page: number,size: number,): Promise<FaqEntry[]>;

  abstract update(id: number,entity: FaqEntry,): Promise<FaqEntry>;

  abstract delete(id: number,): Promise<void>;

  abstract search(question: string,isActive: boolean,page: number,size: number,): Promise<FaqEntry[]>;

  abstract updateStatus(id: number,status: boolean,): Promise<void>;
}