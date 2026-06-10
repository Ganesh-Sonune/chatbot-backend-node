import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { TrainerRequestDto } from '../dto/trainer-request.dto';
import { TrainerResponseDto } from '../dto/trainer-response.dto';
import { TrainerMapper } from '../mapper/trainer.mapper';
import { TrainerService } from '../service/trainer.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../security/jwt-auth.guard';
import { RolesGuard } from '../security/roles.guard';
import { Roles } from '../security/roles.decorator';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';

@Controller('api/trainers')
export class TrainerController {

  constructor(private readonly service: TrainerService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROLE_ADMIN')
  @Post()
  async createTrainer(
    @Body() dto: TrainerRequestDto,
  ): Promise<PaginatedResponseDto<TrainerResponseDto>> {

    const entity = TrainerMapper.toEntity(dto);
    const saved = await this.service.create(entity);

    return {
      data: [TrainerMapper.toDTO(saved)],
      total: 1,
      page: 0,
      size: 1,
      totalPages: 1,
    };
  }

  @Get()
  async search(
    @Query('name') name = '',
    @Query('email') email = '',
    @Query('specialization') specialization = '',
    @Query('minExp') minExp = 0,
    @Query('page') page = 0,
    @Query('size') size = 5,
  ): Promise<PaginatedResponseDto<TrainerResponseDto>> {

    const result = await this.service.search(
      name,
      email,
      specialization,
      Number(minExp),
      Number(page),
      Number(size),
    );

    return {
      data: result.data.map(t => TrainerMapper.toDTO(t)),
      total: result.total,
      page: Number(page),
      size: Number(size),
      totalPages: result.totalPages,
    };
  }

  @Get(':id')
  async getById(
    @Param('id') id: number,
  ): Promise<PaginatedResponseDto<TrainerResponseDto>> {

    const trainer = await this.service.getById(Number(id));

    return {
      data: [TrainerMapper.toDTO(trainer)],
      total: 1,
      page: 0,
      size: 1,
      totalPages: 1,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROLE_ADMIN')
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: TrainerRequestDto,
  ): Promise<PaginatedResponseDto<TrainerResponseDto>> {

    const entity = TrainerMapper.toEntity(dto);
    const updated = await this.service.update(Number(id), entity);

    return {
      data: [TrainerMapper.toDTO(updated)],
      total: 1,
      page: 0,
      size: 1,
      totalPages: 1,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROLE_ADMIN')
  @Delete(':id')
  async delete(
    @Param('id') id: number,
  ): Promise<PaginatedResponseDto<string>> {

    await this.service.delete(Number(id));

    return {
      data: ['Trainer deleted successfully'],
      total: 1,
      page: 0,
      size: 1,
      totalPages: 1,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROLE_ADMIN')
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Query('status') status: string,
  ): Promise<PaginatedResponseDto<string>> {

    await this.service.updateStatus(Number(id), status === 'true');

    return {
      data: ['Trainer status updated successfully'],
      total: 1,
      page: 0,
      size: 1,
      totalPages: 1,
    };
  }
}