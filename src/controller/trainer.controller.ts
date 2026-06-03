// trainer.controller.ts

import { Body,Controller,Delete,Get,Param,Patch,Post,Put,Query, }from '@nestjs/common';
import { ApiResponseDto }from '../dto/api-response.dto';
import { TrainerRequestDto }from '../dto/trainer-request.dto';
import { TrainerResponseDto }from '../dto/trainer-response.dto';
import { TrainerMapper }from '../mapper/trainer.mapper';
import { TrainerService }from '../service/trainer.service';
import { UseGuards }from '@nestjs/common';
import { JwtAuthGuard }from '../security/jwt-auth.guard';
import { RolesGuard }from '../security/roles.guard';
import { Roles }from '../security/roles.decorator';

@Controller('api/trainers')
export class TrainerController {

constructor(private readonly service:TrainerService,){}


@UseGuards(JwtAuthGuard,RolesGuard,)
@Roles('ROLE_ADMIN',)
@Post()
async createTrainer(@Body()dto:TrainerRequestDto,):Promise<ApiResponseDto<TrainerResponseDto>>{
const entity=TrainerMapper.toEntity(dto,);
const saved=await this.service.create(entity,);
return {
success:true,
message:'Trainer created',
data:TrainerMapper.toDTO(saved,),
};
}

@Get()
async search(@Query('name')name='',@Query('email')email='',@Query('specialization')specialization='',@Query('minExp')minExp=0,@Query('page')page=0,@Query('size')size=5,):Promise<ApiResponseDto<TrainerResponseDto[]>>{
const result=await this.service.search(name,email,specialization,Number(minExp),Number(page),Number(size),);
return {
success:true,
message:'Filtered trainers',
data:result.map(trainer=>TrainerMapper.toDTO(trainer,),),
};
}

@Get(':id')
async getById(@Param('id')id:number,):Promise<ApiResponseDto<TrainerResponseDto>>{
const trainer=await this.service.getById(Number(id),);
return {
success:true,
message:'Trainer found',
data:TrainerMapper.toDTO(trainer,),
};
}


@UseGuards(JwtAuthGuard,RolesGuard,)
@Roles('ROLE_ADMIN',)
@Put(':id')
async update(@Param('id')id:number,@Body()dto:TrainerRequestDto,):Promise<ApiResponseDto<TrainerResponseDto>>{
const entity=TrainerMapper.toEntity(dto,);
const updated=await this.service.update(Number(id),entity,);
return {
success:true,
message:'Trainer updated',
data:TrainerMapper.toDTO(updated,),
};
}


@UseGuards(JwtAuthGuard,RolesGuard,)
@Roles('ROLE_ADMIN',)
@Delete(':id')
async delete(@Param('id')id:number,):Promise<ApiResponseDto<string>>{
await this.service.delete(Number(id),);
return {
success:true,
message:'Trainer deleted',
data:'Trainer deleted successfully',
};
}


@UseGuards(JwtAuthGuard,RolesGuard,)
@Roles('ROLE_ADMIN',)
@Patch(':id/status')
async updateStatus(@Param('id')id:number,@Query('status')status:string,):Promise<ApiResponseDto<string>>{
await this.service.updateStatus(Number(id),status==='true',);
return {
success:true,
message:'Trainer status updated',
data:'Trainer status updated successfully',
};
}

}