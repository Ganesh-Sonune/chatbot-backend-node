import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReferralRepository } from '../referral.repository';
import { Referral } from '../../entity/referral.entity';

@Injectable()
export class ReferralRepositoryImpl extends ReferralRepository {

    constructor(
        @InjectRepository(Referral)
        private readonly repo: Repository<Referral>,
    ) { super(); }

    async save(referral: Referral): Promise<Referral> {
        return await this.repo.save(referral);
    }

    async findAll(page: number, size: number): Promise<Referral[]> {
        return await this.repo.find({
            skip: page * size,
            take: size,
            order: { createdAt: 'DESC', },
        });
    }

    async findById(id: number): Promise<Referral | null> {
        return await this.repo.findOne({ where: { id, }, });
    }

    async findByReferredPhone(
        phone: string,
    ): Promise<Referral | null> {
        return await this.repo.findOne({
            where: {
                referredPhone: phone,
            },
        });
    }

    async search(
        referrerPhone: string,
        referredPhone: string,
        status: string,
        page: number,
        size: number,
    ): Promise<Referral[]> {
        const qb = this.repo.createQueryBuilder('referral');
        if (referrerPhone) qb.andWhere('referral.referrerPhone LIKE :referrerPhone', { referrerPhone: `%${referrerPhone}%`, });
        if (referredPhone) qb.andWhere('referral.referredPhone LIKE :referredPhone', { referredPhone: `%${referredPhone}%`, });
        if (status) qb.andWhere('referral.status = :status', { status, });
        return await qb.skip(page * size).take(size).orderBy('referral.createdAt', 'DESC').getMany();
    }

    async countByStatus(): Promise<{ status: string; count: number }[]> {
        return await this.repo
            .createQueryBuilder('referral')
            .select('referral.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .groupBy('referral.status')
            .getRawMany();
    }

    async countByCourse(): Promise<{ interestedIn: string; count: number }[]> {
        return await this.repo
            .createQueryBuilder('referral')
            .select('referral.interestedIn', 'interestedIn')
            .addSelect('COUNT(*)', 'count')
            .groupBy('referral.interestedIn')
            .getRawMany();
    }

}