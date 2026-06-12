import { FaqEntry }from '../entity/faq-entry.entity';

export abstract class FaqService {

  abstract create(entity: FaqEntry,): Promise<FaqEntry>;

  abstract getById(id: number,): Promise<FaqEntry>;

  abstract getAll(page: number, size: number): Promise<{
             data: FaqEntry[];
             total: number;
             page: number;
             size: number;
             totalPages: number;
           }>;

  abstract update(id: number,entity: FaqEntry,): Promise<FaqEntry>;

  abstract delete(id: number,): Promise<void>;

  abstract search(
             question: string,
             isActive: boolean | undefined,
             page: number,
             size: number
           ): Promise<{
             data: FaqEntry[];
             total: number;
           }>;
  abstract updateStatus(id: number,status: boolean,): Promise<void>;
}