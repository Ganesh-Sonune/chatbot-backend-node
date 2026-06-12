import { Injectable } from '@nestjs/common';
import { Referral } from '../../entity/referral.entity';
import { ResourceNotFoundException } from '../../exception/resource-not-found.exception';
import { ReferralRepository } from '../../repository/referral.repository';
import { ReferralService } from '../referral.service';

@Injectable()
export class ReferralServiceImpl extends ReferralService {

  constructor(private readonly repo: ReferralRepository) {
    super();
  }

  async getById(id: number): Promise<Referral> {
    const referral = await this.repo.findById(id);
    if (!referral) {
      throw new ResourceNotFoundException(`Referral not found: ${id}`);
    }
    return referral;
  }

  async search(
    referrerPhone: string,
    referredPhone: string,
    status: string,
    page: number,
    size: number,
  ) {
    const result = await this.repo.search(
      referrerPhone,
      referredPhone,
      status,
      page,
      size,
    );

    return {
      data: result.data,
      total: result.total,
      page,
      size,
      totalPages: result.totalPages,
    };
  }

  async updateStatus(id: number, status: string): Promise<void> {
    const referral = await this.getById(id);
    referral.status = status;
    await this.repo.save(referral);
  }
}