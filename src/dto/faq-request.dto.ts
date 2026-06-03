import { IsNotEmpty } from 'class-validator';

export class FaqRequestDto {

  @IsNotEmpty()
  question!: string;

  @IsNotEmpty()
  answer!: string;

  status!: boolean;
}