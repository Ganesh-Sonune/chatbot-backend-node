import { IntentType }from '../model/intent-type.model';

export abstract class AIIntentService {

  abstract detectIntent(message: string,): IntentType;
}