import { BotConfig }from '../entity/bot-config.entity';

export abstract class BotConfigRepository {

  abstract save(config: BotConfig,): Promise<BotConfig>;

  abstract delete(config: BotConfig,): Promise<void>;

  abstract findByConfigKey(configKey: string,): Promise<BotConfig | null>;

  abstract existsByConfigKey( configKey: string,): Promise<boolean>;

  abstract search( keyFilter: any, valueFilter: any, page: number, size: number,): Promise<BotConfig[]>;

}