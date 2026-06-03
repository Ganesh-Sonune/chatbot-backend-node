// repository/impl/faq.repository.impl.ts

import { Injectable }from '@nestjs/common';
import { InjectRepository }from '@nestjs/typeorm';
import { ILike,Repository }from 'typeorm';
import { FaqRepository }from '../faq.repository';
import { FaqEntry }from '../../entity/faq-entry.entity';

@Injectable()
export class FaqRepositoryImpl extends FaqRepository {

constructor(
@InjectRepository(FaqEntry)
private readonly repo:Repository<FaqEntry>,
){super();}

async save(faq:FaqEntry,):Promise<FaqEntry>{
return await this.repo.save(faq,);
}

async delete(faq:FaqEntry,):Promise<void>{
await this.repo.remove(faq,);
}

async findById(id:number,):Promise<FaqEntry|null>{
return await this.repo.findOne({where:{id,},});
}

async findAll(page:number,size:number,):Promise<FaqEntry[]>{
return await this.repo.find({
skip:page*size,
take:size,
});
}

async searchByKeyword(keyword: string): Promise<FaqEntry[]> {
  return await this.repo
    .createQueryBuilder('faq')
    .where('faq.status = 1')
    .andWhere('(faq.question LIKE :kw OR faq.answer LIKE :kw)', { kw: `%${keyword}%` })
    .getMany();
}

async searchByQuestion(cleaned: string): Promise<FaqEntry[]> {
  return await this.repo
    .createQueryBuilder('faq')
    .where('faq.status = 1')
    .andWhere('faq.question LIKE :q', { q: `%${cleaned}%` })
    .getMany();
}

async countByQuestion(): Promise<any[]> {
  return await this.repo
    .createQueryBuilder('faq')
    .select('faq.question', 'question')
    .addSelect('COUNT(*)', 'count')
    .where('faq.status = 1')
    .groupBy('faq.question')
    .getRawMany();
}
async search(questionFilter:any,statusFilter:any,page:number,size:number,):Promise<FaqEntry[]>{
return await this.repo.find({
where:{
...questionFilter,
...statusFilter,
},
skip:page*size,
take:size,
});
}

}