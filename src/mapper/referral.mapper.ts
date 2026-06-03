import { ReferralResponseDto } from 'src/dto/referral-response.dto';
import { Referral } from '../entity/referral.entity';


export class ReferralMapper {

    static toDTO(referral: Referral): ReferralResponseDto {
        const dto = new ReferralResponseDto();
        dto.id            = referral.id;
        dto.referrerName  = referral.referrerName;
        dto.referrerPhone = referral.referrerPhone;
        dto.referredName  = referral.referredName;
        dto.referredPhone = referral.referredPhone;
        dto.interestedIn  = referral.interestedIn;
        dto.status        = referral.status;
        dto.createdAt     = referral.createdAt;
        return dto;
    }

}