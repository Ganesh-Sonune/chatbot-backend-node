import { IsNotEmpty } from 'class-validator';

export class BotConfigRequestDto {

  @IsNotEmpty()
  configKey!: string;

  configValue!: string;
}