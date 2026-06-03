import { Lead }from '../entity/lead.entity';

export abstract class LeadRepository {

  abstract save(lead: Lead,): Promise<Lead>;

  abstract delete(lead: Lead,): Promise<void>;

  abstract findById(id: number,): Promise<Lead | null>;

  abstract countByStatus(): Promise<any[]>;

  abstract countByCourse(): Promise<any[]>;

  abstract countByDate(from: Date,): Promise<any[]>;

  abstract search(phoneFilter:any,statusFilter:any,requestTypeFilter:any,page:number,size:number,):Promise<Lead[]>;

  }