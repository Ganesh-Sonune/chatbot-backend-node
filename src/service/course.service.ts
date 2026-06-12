import { Course } from '../entity/course.entity';

export abstract class CourseService {

  abstract create(course: Course): Promise<Course>;

  abstract getById(id: number): Promise<Course>;

  abstract getAll(page: number, size: number): Promise<{
    data: Course[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
  }>;

  abstract update(id: number, course: Course): Promise<Course>;

  abstract delete(id: number): Promise<void>;

  abstract search(
    name: string,
    mode: string,
    isActive: boolean | undefined,
    page: number,
    size: number,
  ): Promise<{
    data: Course[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
  }>;

  abstract updateStatus(id: number, status: boolean): Promise<void>;
}