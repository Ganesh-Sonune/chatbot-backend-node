import { Injectable } from '@nestjs/common';
import { DurationParserService } from '../duration-parser.service';
import { DurationFilterModel, Operator } from '../../model/duration-filter.model';
import { BotConfigRepository } from '../../repository/bot-config.repository';

@Injectable()
export class DurationParserServiceImpl implements DurationParserService {
  constructor(private readonly configRepo: BotConfigRepository) {}

  async parse(message: string): Promise<DurationFilterModel | null> {
    const lower = message.toLowerCase();

    const lessThanWords = await this.getWords('DURATION_LESS_THAN_WORDS');
    const greaterThanWords = await this.getWords('DURATION_GREATER_THAN_WORDS');
    const equalsWords = await this.getWords('DURATION_EQUALS_WORDS');

    let operator = Operator.NONE;

    if (lessThanWords.some(w => lower.includes(w))) operator = Operator.LESS_THAN;
    else if (greaterThanWords.some(w => lower.includes(w))) operator = Operator.GREATER_THAN;
    else if (equalsWords.some(w => lower.includes(w))) operator = Operator.EQUALS;

    const match = lower.match(/(\d+)\s*weeks?/);
    if (!match) return null;

    if (operator === Operator.NONE) operator = Operator.EQUALS;

    return { operator, weeks: parseInt(match[1]) };
  }

  private async getWords(key: string): Promise<string[]> {
    const config = await this.configRepo.findByConfigKey(key);
    return config ? config.configValue.split(',').map(w => w.trim()) : [];
  }
}