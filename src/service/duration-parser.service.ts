import { DurationFilterModel }from '../model/duration-filter.model';

export abstract class DurationParserService {

  abstract parse(message: string): Promise<DurationFilterModel | null>;

}