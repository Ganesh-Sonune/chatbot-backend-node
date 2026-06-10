import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FaqRepository } from '../faq.repository';
import { FaqEntry } from '../../entity/faq-entry.entity';

@Injectable()
export class FaqRepositoryImpl extends FaqRepository {

  constructor(
    @InjectRepository(FaqEntry)
    private readonly repo: Repository<FaqEntry>,
  ) {
    super();
  }

  // =========================
  // BASIC CRUD
  // =========================

  async save(faq: FaqEntry): Promise<FaqEntry> {
    return await this.repo.save(faq);
  }

  async delete(faq: FaqEntry): Promise<void> {
    await this.repo.remove(faq);
  }

  async findById(id: number): Promise<FaqEntry | null> {
    return await this.repo.findOne({ where: { id } });
  }

  // =========================
  // PAGINATION (FIXED)
  // =========================

  async findAll(page: number, size: number) {
    const [data, total] = await this.repo.findAndCount({
      skip: page * size,
      take: size,
      order: { id: 'DESC' },
    });

    return { data, total };
  }

  // =========================
  // SEARCH (FIXED + CONSISTENT)
  // =========================

  async search(
    question: string,
    isActive: boolean | undefined,
    page: number,
    size: number,
  ) {
    const query = this.repo.createQueryBuilder('faq');

    if (question) {
      query.andWhere(
        '(faq.question LIKE :q OR faq.answer LIKE :q)',
        { q: `%${question}%` },
      );
    }

    if (isActive !== undefined) {
      query.andWhere('faq.status = :status', { status: isActive });
    }

    const [data, total] = await query
      .orderBy('faq.id', 'DESC')
      .skip(page * size)
      .take(size)
      .getManyAndCount();

    return { data, total };
  }

  // =========================
  // OPTIONAL UTIL METHODS
  // =========================

  async searchByKeyword(keyword: string): Promise<FaqEntry[]> {
    return this.repo
      .createQueryBuilder('faq')
      .where('faq.status = 1')
      .andWhere(
        '(faq.question LIKE :kw OR faq.answer LIKE :kw)',
        { kw: `%${keyword}%` },
      )
      .getMany();
  }

  async searchByQuestion(cleaned: string): Promise<FaqEntry[]> {
    return this.repo
      .createQueryBuilder('faq')
      .where('faq.status = 1')
      .andWhere('faq.question LIKE :q', { q: `%${cleaned}%` })
      .getMany();
  }

  async countByQuestion(): Promise<any[]> {
    return this.repo
      .createQueryBuilder('faq')
      .select('faq.question', 'question')
      .addSelect('COUNT(*)', 'count')
      .where('faq.status = 1')
      .groupBy('faq.question')
      .getRawMany();
  }
}