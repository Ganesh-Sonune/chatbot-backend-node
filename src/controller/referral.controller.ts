import { Controller, Get, Inject, Param, Patch, Query, UseGuards, } from '@nestjs/common';
import { JwtAuthGuard } from '../security/jwt-auth.guard';
import { RolesGuard } from '../security/roles.guard';
import { Roles } from '../security/roles.decorator';
import { ReferralService } from 'src/service/referral.service';
import { ReferralResponseDto } from 'src/dto/referral-response.dto';
import { ReferralMapper } from 'src/mapper/referral.mapper';

@Controller('api/referrals')
export class ReferralController {

    constructor(private readonly service: ReferralService ,) { }

    @UseGuards(JwtAuthGuard, RolesGuard,)
    @Roles('ROLE_ADMIN',)
    @Get()
    async search(
        @Query('referrerPhone') referrerPhone = '',
        @Query('referredPhone') referredPhone = '',
        @Query('status') status = '',
        @Query('page') page = 0,
        @Query('size') size = 10,
    ): Promise<ReferralResponseDto[]> {
        const result = await this.service.search(referrerPhone, referredPhone, status, Number(page), Number(size),);
        return result.map(r => ReferralMapper.toDTO(r),);
    }

    @UseGuards(JwtAuthGuard, RolesGuard,)
    @Roles('ROLE_ADMIN',)
    @Get(':id')
    async getById(@Param('id') id: number,): Promise<ReferralResponseDto> {
        const referral = await this.service.getById(Number(id),);
        return ReferralMapper.toDTO(referral,);
    }

    @UseGuards(JwtAuthGuard, RolesGuard,)
    @Roles('ROLE_ADMIN',)
    @Patch(':id/status')
    async updateStatus(
        @Param('id') id: number,
        @Query('status') status: string,
    ): Promise<string> {
        await this.service.updateStatus(Number(id), status,);
        return 'Referral status updated';
    }

}