import { Injectable }from '@nestjs/common';
import { InjectRepository }from '@nestjs/typeorm';
import { Repository }from 'typeorm';
import { LeadRepository }from '../lead.repository';
import { Lead }from '../../entity/lead.entity';

@Injectable()
export class LeadRepositoryImpl extends LeadRepository {

constructor(
@InjectRepository(Lead)
private readonly repo:Repository<Lead>,
){super();}

async save(lead:Lead,):Promise<Lead>{
return await this.repo.save(lead,);
}

async delete(lead:Lead,):Promise<void>{
await this.repo.remove(lead,);
}

async findById(id:number,):Promise<Lead|null>{
return await this.repo.findOne({where:{id,},});
}

async countByStatus():Promise<any[]>{
return await this.repo
.createQueryBuilder('lead')
.select('lead.status','status')
.addSelect('COUNT(*)','count')
.groupBy('lead.status')
.getRawMany();
}

async countByCourse():Promise<any[]>{
return await this.repo
.createQueryBuilder('lead')
.select('lead.interestedIn','interestedIn')
.addSelect('COUNT(*)','count')
.where('lead.interestedIn IS NOT NULL')
.groupBy('lead.interestedIn')
.getRawMany();
}

async countByDate(from:Date,):Promise<any[]>{
return await this.repo
.createQueryBuilder('lead')
.select('DATE(lead.createdAt)','date')
.addSelect('COUNT(*)','count')
.where('lead.createdAt >= :from',{from,})
.groupBy('DATE(lead.createdAt)')
.orderBy('DATE(lead.createdAt)','ASC')
.getRawMany();
}

async search(phoneFilter:any,statusFilter:any,requestTypeFilter:any,page:number,size:number,):Promise<Lead[]>{
return await this.repo.find({
where:{
...phoneFilter,
...statusFilter,
...requestTypeFilter,
},
skip:page*size,
take:size,
});
}

}