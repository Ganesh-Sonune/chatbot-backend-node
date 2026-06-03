import { Intent }from '../entity/intent.entity';

export abstract class IntentDetectorService {

  abstract detect(message:string,):Promise<Intent | null>;

}