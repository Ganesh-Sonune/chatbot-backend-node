import { Injectable } from '@nestjs/common';
import { BotConfig } from '../../entity/bot-config.entity';
import { DuplicateResourceException }from '../../exception/duplicate-resource.exception';
import { ResourceNotFoundException }from '../../exception/resource-not-found.exception';
import { BotConfigRepository }from '../../repository/bot-config.repository';
import { BotConfigService }from '../bot-config.service';
import { BotConfigSpecification }from '../../specification/bot-config.specification';

@Injectable()
export class BotConfigServiceImpl implements BotConfigService {

  constructor(private readonly repo:BotConfigRepository,) {}

  async create(config: BotConfig,): Promise<BotConfig> {
    const exists =await this.repo.existsByConfigKey(config.configKey,);
    if (exists) {throw new DuplicateResourceException('Config key already exists',);}
    return await this.repo.save(config);
  }

 async getByKey(key: string,): Promise<BotConfig> {
  const config =await this.repo.findByConfigKey(key,);
  if (!config) {throw new ResourceNotFoundException(`Config not found: ${key}`,);}
  return config;
}

async update(key: string,config: BotConfig,): Promise<BotConfig> {
  const existing =await this.getByKey(key,);
  existing.configValue =config.configValue;
  return await this.repo.save(existing,);
}

async delete(key: string,): Promise<void> {
  const config =await this.getByKey(key,);
  await this.repo.delete(config,);
}

async search(key: string,value: string,page: number,size: number,): Promise<BotConfig[]> {
  const keyFilter =BotConfigSpecification.hasKey(key,);
  const valueFilter =BotConfigSpecification.hasValue(value,);
  return await this.repo.search(keyFilter,valueFilter,page,size,);
}

}