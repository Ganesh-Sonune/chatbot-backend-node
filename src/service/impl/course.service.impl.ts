import { Injectable } from '@nestjs/common';
import { Course }from '../../entity/course.entity';
import { ResourceNotFoundException }from '../../exception/resource-not-found.exception';
import { CourseRepository }from '../../repository/course.repository';
import { CourseService }from '../course.service';
import { CourseSpecification }from '../../specification/course.specification';

@Injectable()
export class CourseServiceImpl implements CourseService {

  constructor(private readonly repo:CourseRepository,) {}

  async create(course: Course,): Promise<Course> {
    return await this.repo.save(course,);
  }

  async getById(id: number,): Promise<Course> {
    const course =await this.repo.findById(id,);
    if (!course) {throw new ResourceNotFoundException(`Course not found: ${id}`,);}
    return course;
  }

  async getAll(page: number,size: number,): Promise<Course[]> {
    return await this.repo.findAll(page,size,);
  }

  async update(id: number,course: Course,): Promise<Course> {
    const existing =await this.getById(id,);
    existing.name =course.name;
    existing.duration =course.duration;
    existing.skills =course.skills;
    existing.mode =course.mode;
    existing.highlights =course.highlights;
    existing.status =course.status;
    return await this.repo.save(existing,);
  }

  async delete(id: number,): Promise<void> {
    const existing =await this.getById(id,);
    await this.repo.delete(existing,);
  }

  async search(name:string,mode:string,isActive:boolean | undefined,page:number,size:number,):Promise<Course[]>{
    const nameFilter =CourseSpecification.hasName(name,);
    const modeFilter =CourseSpecification.hasMode(mode,);
    const statusFilter =CourseSpecification.isActive(isActive,);
    return await this.repo.search(nameFilter,modeFilter,statusFilter,page,size,);
  }

  async updateStatus(id: number,status: boolean,): Promise<void> {
    const course =await this.getById(id,);
    course.status =status;
    await this.repo.save(course,);
  }

}