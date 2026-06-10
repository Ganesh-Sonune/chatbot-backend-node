import { Intent } from '../entity/intent.entity';

export class IntentPageResponse {
  data: Intent[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}