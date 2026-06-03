import { Body,Controller,Delete,Get,Param,Patch,Post,Put,Query,UseGuards,}from '@nestjs/common';
import { CourseRequestDto }from '../dto/course-request.dto';
import { CourseResponseDto }from '../dto/course-response.dto';
import { CourseMapper }from '../mapper/course.mapper';
import { CourseService }from '../service/course.service';
import { JwtAuthGuard }from '../security/jwt-auth.guard';
import { RolesGuard }from '../security/roles.guard';
import { Roles }from '../security/roles.decorator';

@Controller('api/courses')
export class CourseController {

constructor(private readonly service:CourseService,){}

@UseGuards(JwtAuthGuard,RolesGuard,)
@Roles('ROLE_ADMIN',)
@Post()
async create(@Body()dto:CourseRequestDto,):Promise<CourseResponseDto>{
const entity=CourseMapper.toEntity(dto,);
const saved=await this.service.create(entity,);
return CourseMapper.toDTO(saved,);
}

@Get(':id')
async get(@Param('id')id:number,):Promise<CourseResponseDto>{
const course=await this.service.getById(Number(id),);
return CourseMapper.toDTO(course,);
}

@UseGuards(JwtAuthGuard,RolesGuard,)
@Roles('ROLE_ADMIN',)
@Put(':id')
async update(@Param('id')id:number,@Body()dto:CourseRequestDto,):Promise<CourseResponseDto>{
const entity=CourseMapper.toEntity(dto,);
const updated=await this.service.update(Number(id),entity,);
return CourseMapper.toDTO(updated,);
}

@UseGuards(JwtAuthGuard,RolesGuard,)
@Roles('ROLE_ADMIN',)
@Delete(':id')
async delete(@Param('id')id:number,):Promise<string>{
await this.service.delete(Number(id),);
return 'Deleted successfully';
}

@Get()
async search(@Query('name')name='',@Query('mode')mode='',@Query('isActive')isActive?:string,@Query('page')page=0,@Query('size')size=5,):Promise<CourseResponseDto[]>{
const statusFilter=isActive===undefined?undefined:isActive==='true';
const result=await this.service.search(name,mode,statusFilter as any,Number(page),Number(size),);
return result.map(course=>CourseMapper.toDTO(course,),);
}

@UseGuards(JwtAuthGuard,RolesGuard,)
@Roles('ROLE_ADMIN',)
@Patch(':id/status')
async updateStatus(@Param('id')id:number,@Query('status')status:string,):Promise<string>{
await this.service.updateStatus(Number(id),status==='true',);
return 'Course status updated';
}

}