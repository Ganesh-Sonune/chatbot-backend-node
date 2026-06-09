import { Body,Controller,Delete,Get,Param,Patch,Post,Put,Query, }from '@nestjs/common';
import { FaqRequestDto }from '../dto/faq-request.dto';
import { FaqResponseDto }from '../dto/faq-response.dto';
import { FaqMapper }from '../mapper/faq.mapper';
import { FaqService }from '../service/faq.service';
import { UseGuards }from '@nestjs/common';
import { JwtAuthGuard }from '../security/jwt-auth.guard';
import { RolesGuard }from '../security/roles.guard';
import { Roles }from '../security/roles.decorator';

@Controller('api/faqs')
export class FaqController {

constructor(private readonly service:FaqService,){}

@UseGuards(JwtAuthGuard,RolesGuard,)
@Roles('ROLE_ADMIN',)
@Post()
async create(@Body()dto:FaqRequestDto,):Promise<FaqResponseDto>{
const entity=FaqMapper.toEntity(dto,);
const saved=await this.service.create(entity,);
return FaqMapper.toDTO(saved,);
}

@Get(':id')
async get(@Param('id')id:number,):Promise<FaqResponseDto>{
const faq=await this.service.getById(Number(id),);
return FaqMapper.toDTO(faq,);
}

@UseGuards(JwtAuthGuard,RolesGuard,)
@Roles('ROLE_ADMIN',)
@Put(':id')
async update(@Param('id')id:number,@Body()dto:FaqRequestDto,):Promise<FaqResponseDto>{
const entity=FaqMapper.toEntity(dto,);
const updated=await this.service.update(Number(id),entity,);
return FaqMapper.toDTO(updated,);
}

@UseGuards(JwtAuthGuard,RolesGuard,)
@Roles('ROLE_ADMIN',)
@Delete(':id')
async delete(@Param('id')id:number,):Promise<string>{
await this.service.delete(Number(id),);
return 'Deleted successfully';
}



@Get()
async search(@Query('question')question='',@Query('isActive')isActive?:string,@Query('page')page=0,@Query('size')size=5,):Promise<FaqResponseDto[]>{
const statusFilter=isActive===undefined?undefined:isActive==='true';
const result=await this.service.search(question,statusFilter as any,Number(page),Number(size),);
return result.map(faq=>FaqMapper.toDTO(faq,),);
}

@UseGuards(JwtAuthGuard,RolesGuard,)
@Roles('ROLE_ADMIN',)
@Patch(':id/status')
async updateStatus(@Param('id')id:number,@Query('status')status:string,):Promise<string>{
await this.service.updateStatus(Number(id),status==='true',);
return 'FAQ status updated';
}

}