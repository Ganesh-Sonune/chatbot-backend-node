import { FaqEntry }from '../entity/faq-entry.entity';

export abstract class FaqRepository {

  abstract save(faq: FaqEntry,): Promise<FaqEntry>;

  abstract delete(faq: FaqEntry,): Promise<void>;

  abstract findById(id: number,): Promise<FaqEntry | null>;

  abstract findAll(page: number, size: number): Promise<{ data: FaqEntry[]; total: number }>;

  abstract searchByKeyword(keyword: string,): Promise<FaqEntry[]>;

  abstract searchByQuestion(question: string,): Promise<FaqEntry[]>;

  abstract countByQuestion(): Promise<any[]>;

  abstract search(
             question: string,
             isActive: boolean | undefined,
             page: number,
             size: number
           ): Promise<{ data: FaqEntry[]; total: number }>;

}