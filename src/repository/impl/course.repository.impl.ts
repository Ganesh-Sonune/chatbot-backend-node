// repository/impl/course.repository.impl.ts

import { Injectable }from '@nestjs/common';
import { InjectRepository }from '@nestjs/typeorm';
import { ILike,Repository }from 'typeorm';
import { CourseRepository }from '../course.repository';
import { Course }from '../../entity/course.entity';

@Injectable()
export class CourseRepositoryImpl extends CourseRepository {

constructor(
@InjectRepository(Course)
private readonly repo:Repository<Course>,
){super();}

async save(course:Course,):Promise<Course>{
return await this.repo.save(course,);
}

async delete(course:Course,):Promise<void>{
await this.repo.remove(course,);
}

async findById(id:number,):Promise<Course|null>{
return await this.repo.findOne({where:{id,},});
}

async findAll(page:number,size:number,):Promise<Course[]>{
return await this.repo.find({
skip:page*size,
take:size,
});
}

async searchByKeyword(keyword:string,):Promise<Course[]>{
return await this.repo.find({
where:{
name:ILike(`%${keyword}%`,),
status:true,
},
});
}

async findByStatusTrue():Promise<Course[]>{
return await this.repo.find({
where:{
status:true,
},
});
}

async findByModeContainingIgnoreCaseAndStatusTrue(mode:string,):Promise<Course[]>{
return await this.repo.find({
where:{
mode:ILike(`%${mode}%`,),
status:true,
},
});
}

async countByMode():Promise<any[]>{
return await this.repo
.createQueryBuilder('course')
.select('course.mode','mode')
.addSelect('COUNT(*)','count')
.where('course.status = :status',{status:true,})
.groupBy('course.mode')
.getRawMany();
}

async search(nameFilter:any,modeFilter:any,statusFilter:any,page:number,size:number,):Promise<Course[]>{
return await this.repo.find({
where:{
...nameFilter,
...modeFilter,
...statusFilter,
},
skip:page*size,
take:size,
});
}

}