import { Injectable }from '@nestjs/common';
import { Intent }from '../../entity/intent.entity';
import { DuplicateResourceException }from '../../exception/duplicate-resource.exception';
import { ResourceNotFoundException }from '../../exception/resource-not-found.exception';
import { IntentRepository }from '../../repository/intent.repository';
import { IntentService }from '../intent.service';

@Injectable()
export class IntentServiceImpl implements IntentService {

  constructor(private readonly repo:IntentRepository,) {}

  async create(intent:Intent,):Promise<Intent> {
    const exists=await this.repo.existsByIntentName(intent.intentName,);
    if(exists){throw new DuplicateResourceException(`Intent already exists: ${intent.intentName}`,);}
    return await this.repo.save(intent,);
  }

  async getById(id:number,):Promise<Intent> {
    const intent=await this.repo.findById(id,);
    if(!intent){throw new ResourceNotFoundException(`Intent not found: ${id}`,);}
    return intent;
  }

  async getAll(page:number,size:number,):Promise<Intent[]> {
    return await this.repo.findAll(page,size,);
  }

  async update(id:number,intent:Intent,):Promise<Intent> {
    const existing=await this.getById(id,);
    if(existing.intentName.toLowerCase()!==intent.intentName.toLowerCase()){
      const exists=await this.repo.existsByIntentName(intent.intentName,);
      if(exists){throw new DuplicateResourceException('Intent name already taken',);}
    }
    existing.intentName=intent.intentName;
    existing.keywords=intent.keywords;
    existing.actionType=intent.actionType;
    existing.responseTemplate=intent.responseTemplate;
    existing.status=intent.status;
    return await this.repo.save(existing,);
  }

  async delete(id:number,):Promise<void> {
    const existing=await this.getById(id,);
    await this.repo.delete(existing,);
  }

  async updateStatus(id:number,status:boolean,):Promise<void> {
    const existing=await this.getById(id,);
    existing.status=status;
    await this.repo.save(existing,);
  }

}