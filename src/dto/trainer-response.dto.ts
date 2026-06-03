export class TrainerResponseDto {

  id: number;

  name: string;

  email: string;

  specialization: string;

  experience: number;

  courseName: string;

  status: boolean;

  constructor(
    id: number,
    name: string,
    email: string,
    specialization: string,
    experience: number,
    courseName: string,
    status: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.specialization = specialization;
    this.experience = experience;
    this.courseName = courseName;
    this.status = status;
  }
}