// intent.controller.ts

import { Body,Controller,Delete,Get,Param,Patch,Post,Put,Query, }from '@nestjs/common';
import { Intent }from '../entity/intent.entity';
import { IntentService }from '../service/intent.service';
import { UseGuards }from '@nestjs/common';
import { JwtAuthGuard }from '../security/jwt-auth.guard';
import { RolesGuard }from '../security/roles.guard';
import { Roles }from '../security/roles.decorator';

@Controller('api/intents')
export class IntentController {

constructor(private readonly service:IntentService,){}

@UseGuards(JwtAuthGuard,RolesGuard,)
@Roles('ROLE_ADMIN',)
@Post()
async create(@Body()intent:Intent,):Promise<Intent>{
return await this.service.create(intent,);
}

@Get(':id')
async getById(@Param('id')id:number,):Promise<Intent>{
return await this.service.getById(Number(id),);
}

@Get()
async getAll(@Query('page')page=0,@Query('size')size=10,):Promise<Intent[]>{
return await this.service.getAll(Number(page),Number(size),);
}


@UseGuards(JwtAuthGuard,RolesGuard,)
@Roles('ROLE_ADMIN',)
@Put(':id')
async update(@Param('id')id:number,@Body()intent:Intent,):Promise<Intent>{
return await this.service.update(Number(id),intent,);
}


@UseGuards(JwtAuthGuard,RolesGuard,)
@Roles('ROLE_ADMIN',)
@Delete(':id')
async delete(@Param('id')id:number,):Promise<string>{
await this.service.delete(Number(id),);
return 'Intent deleted';
}


@UseGuards(JwtAuthGuard,RolesGuard,)
@Roles('ROLE_ADMIN',)
@Patch(':id/status')
async updateStatus(@Param('id')id:number,@Query('status')status:string,):Promise<string>{
await this.service.updateStatus(Number(id),status==='true',);
return 'Intent status updated';
}

}