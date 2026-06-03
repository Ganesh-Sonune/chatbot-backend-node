export class BotConfigResponseDto {

  id: number;

  configKey: string;

  configValue: string;

  constructor(
    id: number,
    configKey: string,
    configValue: string,
  ) {
    this.id = id;
    this.configKey = configKey;
    this.configValue = configValue;
  }
}   