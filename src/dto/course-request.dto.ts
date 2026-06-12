import { IsNotEmpty } from 'class-validator';

export class CourseRequestDto {

  @IsNotEmpty()
  name!: string;

  duration!: string;

  skills!: string;

  mode!: string;

  highlights!: string;

  status!: boolean;

  batchTiming?: string;

  nextBatchDate?: string;

  brochureUrl?: string;

  placementSupport?: string;

  placementPercentage?: string;

  highestPackage?: string;

  hiringCompanies?: string;
}