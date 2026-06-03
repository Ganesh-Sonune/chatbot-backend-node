import { Course }from '../entity/course.entity';

export abstract class CourseRepository {

  abstract save(course: Course,): Promise<Course>;

  abstract delete(course: Course,): Promise<void>;

  abstract findById(id: number,): Promise<Course | null>;

  abstract findAll(page: number,size: number,): Promise<Course[]>;

  abstract searchByKeyword(keyword: string,): Promise<Course[]>;

  abstract findByStatusTrue():Promise<Course[]>;

  abstract findByModeContainingIgnoreCaseAndStatusTrue( mode: string,): Promise<Course[]>;

  abstract countByMode():Promise<any[]>;

  abstract search(nameFilter: any,modeFilter: any,statusFilter: any,page: number,size: number,): Promise<Course[]>;

}