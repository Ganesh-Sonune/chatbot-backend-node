import { BotConfig }from '../entity/bot-config.entity';

export abstract class BotConfigService {

  abstract create(config: BotConfig,): Promise<BotConfig>;

  abstract getByKey(key: string,): Promise<BotConfig>;

  abstract update(key: string,config: BotConfig,): Promise<BotConfig>;

  abstract delete(key: string,): Promise<void>;

  abstract search(key: string,value: string,page: number,size: number,): Promise<BotConfig[]>;

}