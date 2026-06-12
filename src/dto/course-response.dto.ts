export class CourseResponseDto {

  id: number;

  name: string;

  duration: string;

  skills: string;

  mode: string;

  highlights: string;

  status: boolean;

  batchTiming?: string;

  nextBatchDate?: string;

  brochureUrl?: string;

  placementSupport?: string;

  placementPercentage?: string;

  highestPackage?: string;

  hiringCompanies?: string;

  constructor(
    id: number,
    name: string,
    duration: string,
    skills: string,
    mode: string,
    highlights: string,
    status: boolean,
    batchTiming?: string,
    nextBatchDate?: string,
    brochureUrl?: string,
    placementSupport?: string,
    placementPercentage?: string,
    highestPackage?: string,
    hiringCompanies?: string,
  ) {
    this.id = id;
    this.name = name;
    this.duration = duration;
    this.skills = skills;
    this.mode = mode;
    this.highlights = highlights;
    this.status = status;

    this.batchTiming = batchTiming;
    this.nextBatchDate = nextBatchDate;
    this.brochureUrl = brochureUrl;

    this.placementSupport = placementSupport;
    this.placementPercentage = placementPercentage;
    this.highestPackage = highestPackage;
    this.hiringCompanies = hiringCompanies;
  }
}