import { Referral } from '../entity/referral.entity';

export abstract class ReferralService {

  abstract getById(id: number): Promise<Referral>;

  abstract search(
    referrerPhone: string,
    referredPhone: string,
    status: string,
    page: number,
    size: number,
  ): Promise<{
    data: Referral[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
  }>;

  abstract updateStatus(id: number, status: string): Promise<void>;
}