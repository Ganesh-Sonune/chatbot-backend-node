import { Lead }from '../entity/lead.entity';

export abstract class LeadService {

  abstract create(lead: Lead,): Promise<Lead>;

  abstract getById(id: number,): Promise<Lead>;

  abstract search(phone: string,status: string,requestType: string,page: number,size: number,): Promise<Lead[]>;

  abstract updateStatus(id: number,status: string,): Promise<void>;

}