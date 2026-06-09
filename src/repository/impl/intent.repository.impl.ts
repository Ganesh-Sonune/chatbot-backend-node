import { Injectable }from '@nestjs/common';
import { InjectRepository }from '@nestjs/typeorm';
import { ILike,Repository }from 'typeorm';
import { IntentRepository }from '../intent.repository';
import { Intent }from '../../entity/intent.entity';

@Injectable()
export class IntentRepositoryImpl extends IntentRepository {

constructor(
@InjectRepository(Intent)
private readonly repo:Repository<Intent>,
){super();}

async save(intent:Intent,):Promise<Intent>{
return await this.repo.save(intent,);
}

async delete(intent:Intent,):Promise<void>{
await this.repo.remove(intent,);
}

async findById(id:number,):Promise<Intent|null>{
return await this.repo.findOne({where:{id,},});
}

async findAll(page:number,size:number,):Promise<Intent[]>{
return await this.repo.find({
skip:page*size,
take:size,
});
}

async findByStatusTrue():Promise<Intent[]>{
return await this.repo.find({
where:{
status:true,
},
});
}

async findByIntentNameIgnoreCase(intentName:string,):Promise<Intent|null>{
return await this.repo.findOne({
where:{
intentName:ILike(intentName,),
},
});
}

async existsByIntentName(intentName:string,):Promise<boolean>{
const count=await this.repo.count({
where:{
intentName,
},
});
return count>0;
}

}