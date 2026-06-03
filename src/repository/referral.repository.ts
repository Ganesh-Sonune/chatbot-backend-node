import { Injectable } from '@nestjs/common';
import { Referral } from '../entity/referral.entity';

@Injectable()
export abstract class ReferralRepository {
    abstract save(referral: Referral): Promise<Referral>;
    abstract findAll(page: number, size: number): Promise<Referral[]>;
    abstract findById(id: number): Promise<Referral | null>;
    abstract search(referrerPhone: string, referredPhone: string, status: string, page: number, size: number): Promise<Referral[]>;
    abstract countByStatus(): Promise<{ status: string; count: number }[]>;
    abstract countByCourse(): Promise<{ interestedIn: string; count: number }[]>;
}