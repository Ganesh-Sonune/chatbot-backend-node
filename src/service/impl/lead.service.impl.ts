import { Injectable }from '@nestjs/common';
import { Lead }from '../../entity/lead.entity';
import { ResourceNotFoundException }from '../../exception/resource-not-found.exception';
import { LeadRepository }from '../../repository/lead.repository';
import { LeadService }from '../lead.service';
import { LeadSpecification }from '../../specification/lead.specification';

@Injectable()
export class LeadServiceImpl implements LeadService {

  constructor(private readonly repo:LeadRepository,) {}

  async create(lead:Lead,):Promise<Lead> {
    return await this.repo.save(lead,);
  }

  async getById(id:number,):Promise<Lead> {
    const lead=await this.repo.findById(id,);
    if(!lead){throw new ResourceNotFoundException(`Lead not found: ${id}`,);}
    return lead;
  }

  async search(phone:string,status:string,requestType:string,page:number,size:number,):Promise<Lead[]> {
    const phoneFilter=LeadSpecification.hasPhone(phone,);
    const statusFilter=LeadSpecification.hasStatus(status,);
    const requestTypeFilter=LeadSpecification.hasRequestType(requestType,);
    return await this.repo.search(phoneFilter,statusFilter,requestTypeFilter,page,size,);
  }

  async updateStatus(id:number,status:string,):Promise<void> {
    const lead=await this.getById(id,);
    lead.status=status;
    await this.repo.save(lead,);
  }

}