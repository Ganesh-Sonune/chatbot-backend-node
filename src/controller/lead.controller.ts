import { Body,Controller,Get,Param,Patch,Post,Query, }from '@nestjs/common';
import { LeadRequestDto }from '../dto/lead-request.dto';
import { LeadResponseDto }from '../dto/lead-response.dto';
import { LeadMapper }from '../mapper/lead.mapper';
import { LeadService }from '../service/lead.service';
import { UseGuards }from '@nestjs/common';
import { JwtAuthGuard }from '../security/jwt-auth.guard';
import { RolesGuard }from '../security/roles.guard';
import { Roles }from '../security/roles.decorator';


@Controller('api/leads')
export class LeadController {

constructor(private readonly service:LeadService,){}


@UseGuards(JwtAuthGuard,RolesGuard,)
@Roles('ROLE_ADMIN',)
@Post()
async create(@Body()dto:LeadRequestDto,):Promise<LeadResponseDto>{
const entity=LeadMapper.toEntity(dto,);
const saved=await this.service.create(entity,);
return LeadMapper.toDTO(saved,);
}

@Get(':id')
async get(@Param('id')id:number,):Promise<LeadResponseDto>{
const lead=await this.service.getById(Number(id),);
return LeadMapper.toDTO(lead,);
}

@Get()
async search(@Query('phone')phone='',@Query('status')status='',@Query('requestType')requestType='',@Query('page')page=0,@Query('size')size=10,):Promise<LeadResponseDto[]>{
const result=await this.service.search(phone,status,requestType,Number(page),Number(size),);
return result.map(lead=>LeadMapper.toDTO(lead,),);
}


@UseGuards(JwtAuthGuard,RolesGuard,)
@Roles('ROLE_ADMIN',)
@Patch(':id/status')
async updateStatus(@Param('id')id:number,@Query('status')status:string,):Promise<string>{
await this.service.updateStatus(Number(id),status,);
return 'Lead status updated';
}

}