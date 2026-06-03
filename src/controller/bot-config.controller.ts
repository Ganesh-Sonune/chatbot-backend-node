import { Body, Controller, Delete, Get, Param, Post, Put, Query, } from '@nestjs/common';
import { BotConfigRequestDto } from '../dto/bot-config-request.dto';
import { BotConfigResponseDto } from '../dto/bot-config-response.dto';
import { BotConfigService } from '../service/bot-config.service';
import { BotConfigMapper } from '../mapper/bot-config.mapper';

@Controller('api/config')
export class BotConfigController {

  constructor(private readonly service: BotConfigService,) {}

  @Post()
  async create(@Body() dto: BotConfigRequestDto,): Promise<BotConfigResponseDto> {
    const entity = BotConfigMapper.toEntity(dto,);
    const saved = await this.service.create(entity,);
    return BotConfigMapper.toDTO(saved,);
  }

  @Get(':key')
  async get(@Param('key') key: string,): Promise<BotConfigResponseDto> {
    const config = await this.service.getByKey(key,);
    return BotConfigMapper.toDTO(config,);
  }

  @Put(':key')
  async update(@Param('key') key: string,@Body() dto: BotConfigRequestDto,): Promise<BotConfigResponseDto> {
    const entity = BotConfigMapper.toEntity(dto,);
    const updated = await this.service.update(key,entity,);
    return BotConfigMapper.toDTO(updated,);
  }

  @Delete(':key')
  async delete(@Param('key') key: string,): Promise<string> {
    await this.service.delete(key,);
    return 'Deleted successfully';
  }

  @Get()
  async search(@Query('key') key = '',@Query('value') value = '',@Query('page') page = 0,@Query('size') size = 5,): Promise<BotConfigResponseDto[]> {
    const result = await this.service.search(key,value,Number(page),Number(size),);
    return result.map(botConfig => BotConfigMapper.toDTO(botConfig,),);
  }
  
}