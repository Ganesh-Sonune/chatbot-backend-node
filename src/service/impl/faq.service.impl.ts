import { Injectable } from '@nestjs/common';
import { FaqEntry }from '../../entity/faq-entry.entity';
import { ResourceNotFoundException }from '../../exception/resource-not-found.exception';
import { FaqRepository }from '../../repository/faq.repository';
import { FaqService }from '../faq.service';
import { FaqSpecification }from '../../specification/faq.specification';

@Injectable()
export class FaqServiceImpl implements FaqService {

  constructor(private readonly repo:FaqRepository,) {}

  async create(entity: FaqEntry,): Promise<FaqEntry> {
    return await this.repo.save(entity,);
  }

  async getById(id: number,): Promise<FaqEntry> {
    const faq =await this.repo.findById(id,);
    if (!faq) {throw new ResourceNotFoundException(`FAQ not found: ${id}`,);}
    return faq;
  }

  async getAll(page: number,size: number,): Promise<FaqEntry[]> {
    return await this.repo.findAll(page,size,);
  }

  async update(id: number,entity: FaqEntry,): Promise<FaqEntry> {
    const existing =await this.getById(id,);
    existing.question =entity.question;
    existing.answer =entity.answer;
    existing.status =entity.status;
    return await this.repo.save(existing,);
  }

  async delete(id: number,): Promise<void> {
    const existing =await this.getById(id,);
    await this.repo.delete(existing,);
  }

  async search(question: string,isActive: boolean,page: number,size: number,): Promise<FaqEntry[]> {
    const questionFilter =FaqSpecification.hasQuestion(question,);
    const statusFilter =FaqSpecification.isActive(isActive,);
    return await this.repo.search(questionFilter,statusFilter,page,size,);
  }

  async updateStatus(id: number,status: boolean,): Promise<void> {
    const existing =await this.getById(id,);
    existing.status =status;
    await this.repo.save(existing,);
  }

}