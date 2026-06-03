import {
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class TrainerRequestDto {

  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  phone!: string;

  specialization!: string;

  experience!: number;

  courseName!: string;

  status!: boolean;
}