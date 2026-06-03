import { Injectable } from '@nestjs/common';
import { Intent } from '../../entity/intent.entity';
import { IntentRepository } from '../../repository/intent.repository';
import { IntentDetectorService } from '../intent-detector.service';
import { TextUtil } from '../../util/text-util.util';

@Injectable()
export class IntentDetectorServiceImpl implements IntentDetectorService {
  constructor(private readonly intentRepo: IntentRepository) {}

  async detect(message: string): Promise<Intent | null> {
    if (!message || message.trim() === '') return null;

    const keywords = TextUtil.extract(message);
    const cleaned = TextUtil.clean(message);
    const effectiveKeywords = keywords.length === 0 ? cleaned.split(/\s+/) : keywords;

    const intents = await this.intentRepo.findByStatusTrue();
    const scoreMap = new Map<Intent, number>();

    for (const intent of intents) {
      if (!intent.keywords) continue;
      let score = 0;

      for (const intentKw of intent.keywords.toLowerCase().split(',')) {
        const trimmed = intentKw.trim();
        if (!trimmed) continue;

        if (trimmed.includes(' ')) {
          if (cleaned.includes(trimmed)) score += 3;
        } else {
          for (const kw of effectiveKeywords) {
            if (kw === trimmed) { score += 2; break; }
            if (kw.length > 3 && trimmed.length > 3) {
              if (kw.includes(trimmed) || trimmed.includes(kw)) { score += 1; break; }
              if (this.isFuzzyMatch(kw, trimmed)) { score += 1; break; }
            }
          }
        }
      }

      if (score > 0) {
        scoreMap.set(intent, score);
        console.log(`DEBUG intent: ${intent.intentName} | score: ${score}`);
      }
    }

    const result = [...scoreMap.entries()].reduce<Intent | null>(
      (best, [intent, score]) => (scoreMap.get(best!) ?? 0) >= score ? best : intent,
      null,
    );
    
    console.log(`DEBUG winner intent: ${result ? `${result.intentName} actionType: ${result.actionType}` : 'NULL'}`);

    return result;
  }

private isFuzzyMatch(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 3) return false;
  return this.levenshtein(a, b) <= 2;
}

private levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}
}