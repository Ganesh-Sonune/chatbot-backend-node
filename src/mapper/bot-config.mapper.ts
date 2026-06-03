import { BotConfigRequestDto }
from '../dto/bot-config-request.dto';

import { BotConfigResponseDto }
from '../dto/bot-config-response.dto';

import { BotConfig }
from '../entity/bot-config.entity';

export class BotConfigMapper {

  static toEntity(
    dto: BotConfigRequestDto,
  ): BotConfig {

    const botConfig =
      new BotConfig();

    botConfig.configKey =
      dto.configKey;

    botConfig.configValue =
      dto.configValue;

    return botConfig;
  }

  static toDTO(
    botConfig: BotConfig,
  ): BotConfigResponseDto {

    return new BotConfigResponseDto(

      botConfig.id,

      botConfig.configKey,

      botConfig.configValue,
    );
  }
}