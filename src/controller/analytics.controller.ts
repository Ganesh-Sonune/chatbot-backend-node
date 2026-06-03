import { Controller, Get, Inject, Query, } from '@nestjs/common';

import { CourseRepository } from '../repository/course.repository';
import { FaqRepository } from '../repository/faq.repository';
import { LeadRepository } from '../repository/lead.repository';
import { TrainerRepository } from '../repository/trainer.repository';
import { ReferralRepository } from 'src/repository/referral.repository';

@Controller('api/analytics')
export class AnalyticsController {

    constructor(
        @Inject(LeadRepository) private readonly leadRepo: LeadRepository,
        @Inject(CourseRepository) private readonly courseRepo: CourseRepository,
        @Inject(FaqRepository) private readonly faqRepo: FaqRepository,
        @Inject(TrainerRepository) private readonly trainerRepo: TrainerRepository,
        @Inject(ReferralRepository ) private readonly referralRepo: ReferralRepository,
    ) { }

    @Get('leads/by-status')
    async leadsByStatus(): Promise<Record<string, number>> {
        const result: Record<string, number> = {};
        const rows = await this.leadRepo.countByStatus();
        for (const row of rows) {
            const key = row.status ?? 'Unknown';
            const value = Number(row.count);
            result[key] = value;
        }
        return result;
    }


    @Get('leads/by-course')
    async leadsByCourse(): Promise<Record<string, number>> {
        const result: Record<string, number> = {};
        const rows = await this.leadRepo.countByCourse();
        for (const row of rows) {
            const key = row.interestedIn  ?? 'Unknown';
            const value = Number(row.count);
            result[key] = value;
        }
        return result;
    }

    @Get('courses/by-mode')
    @Get('courses/by-mode')
    async coursesByMode(): Promise<Record<string, number>> {
        const result: Record<string, number> = {};
        const rows = await this.courseRepo.countByMode();
        for (const row of rows) {
            const key = row.mode ?? 'Unknown';
            const value = Number(row.count);
            result[key] = value;
        }
        return result;
    }

    @Get('faqs/top')
    async topFaqs(): Promise<Record<string, number>> {
        const result: Record<string, number> = {};
        const rows = await this.faqRepo.countByQuestion();
        for (let i = 0; i < Math.min(5, rows.length,); i++) {
            const key = String(rows[i].question);
            const value = Number(rows[i].count);
            result[key] = value;
        }
        return result;
    }

    @Get('trainers/by-experience')
    async trainersByExperience(): Promise<Record<string, number>> {

        const result: Record<string, number> = { '0-5 yrs': 0, '6-10 yrs': 0, '11-15 yrs': 0, '15+ yrs': 0, };
        const experiences = await this.trainerRepo.findAllExperiences();

        for (const exp of experiences) {
            if (exp <= 5) { result['0-5 yrs']++; }
            else if (exp <= 10) { result['6-10 yrs']++; }
            else if (exp <= 15) { result['11-15 yrs']++; }
            else { result['15+ yrs']++; }
        }
        return result;
    }


    @Get('leads/over-time')
    async leadsOverTime(@Query('days') days = '7',): Promise<Record<string, number>> {

        const totalDays = Number(days);
        const from = new Date();
        from.setDate(from.getDate() - totalDays);

        const result: Record<string, number> = {};

        for (let i = totalDays - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const label = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', });
            result[label] = 0;
        }

        const rows = await this.leadRepo.countByDate(from,);

        for (const row of rows) {
            const date = new Date(row.date);
            const label = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', });
            const value = Number(row.count);
            result[label] = value;
        }

        return result;
    }

     @Get('referrals/by-status')
    async referralsByStatus(): Promise<Record<string, number>> {
        const result: Record<string, number> = {};
        const rows = await this.referralRepo.countByStatus();
        for (const row of rows) {
            const key = row.status ?? 'Unknown';
            const value = Number(row.count);
            result[key] = value;
        }
        return result;
    }

    @Get('referrals/by-course')
    async referralsByCourse(): Promise<Record<string, number>> {
        const result: Record<string, number> = {};
        const rows = await this.referralRepo.countByCourse();
        for (const row of rows) {
            const key = row.interestedIn ?? 'Unknown';
            const value = Number(row.count);
            result[key] = value;
        }
        return result;
    }
    

}