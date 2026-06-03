import { Injectable }from '@nestjs/common';
import { InjectRepository }from '@nestjs/typeorm';
import { Repository }from 'typeorm';
import { BotConfigRepository }from '../bot-config.repository';
import { BotConfig }from '../../entity/bot-config.entity';

@Injectable()
export class BotConfigRepositoryImpl extends BotConfigRepository {

constructor(
@InjectRepository(BotConfig)
private readonly repo:Repository<BotConfig>,
){super();}

async save(config:BotConfig,):Promise<BotConfig>{
return await this.repo.save(config,);
}

async delete(config:BotConfig,):Promise<void>{
await this.repo.remove(config,);
}

async findByConfigKey(configKey:string,):Promise<BotConfig|null>{
return await this.repo.findOne({where:{configKey,},});
}

async existsByConfigKey(configKey:string,):Promise<boolean>{
const count=await this.repo.count({
where:{
configKey,
},
});
return count>0;
}

async search(keyFilter:any,valueFilter:any,page:number,size:number,):Promise<BotConfig[]>{
return await this.repo.find({
where:{
...keyFilter,
...valueFilter,
},
skip:page*size,
take:size,
});
}

}