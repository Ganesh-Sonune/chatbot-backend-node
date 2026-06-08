import { CourseRequestDto }
from '../dto/course-request.dto';

import { CourseResponseDto }
from '../dto/course-response.dto';

import { Course }
from '../entity/course.entity';

export class CourseMapper {

  static toEntity(
    dto: CourseRequestDto,
  ): Course {

    const course =
      new Course();

    course.name =
      dto.name;

    course.duration =
      dto.duration;

    course.skills =
      dto.skills;

    course.mode =
      dto.mode;

    course.highlights =
      dto.highlights;

    course.status =
      dto.status;

    course.batchTiming =
      dto.batchTiming ?? '';

    course.nextBatchDate =
      dto.nextBatchDate ?? '';

    course.brochureUrl =
      dto.brochureUrl ?? '';

    return course;
  }

  static toDTO(
    course: Course,
  ): CourseResponseDto {

    return new CourseResponseDto(

      course.id,

      course.name,

      course.duration,

      course.skills,

      course.mode,

      course.highlights,

      course.status,

      course.batchTiming,

      course.nextBatchDate,

      course.brochureUrl,
    );
  }
}