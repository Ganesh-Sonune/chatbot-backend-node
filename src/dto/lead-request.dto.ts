import { IsNotEmpty } from 'class-validator';

export class LeadRequestDto {

  name!: string;

  @IsNotEmpty({
    message: 'Phone is required',
  })
  phone!: string;

  email!: string;

  interestedIn!: string;

  requestType!: string;
}