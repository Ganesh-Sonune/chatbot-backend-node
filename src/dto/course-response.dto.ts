export class CourseResponseDto {

  id: number;

  name: string;

  duration: string;

  skills: string;

  mode: string;

  highlights: string;

  status: boolean;

  constructor(
    id: number,
    name: string,
    duration: string,
    skills: string,
    mode: string,
    highlights: string,
    status: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.duration = duration;
    this.skills = skills;
    this.mode = mode;
    this.highlights = highlights;
    this.status = status;
  }
}