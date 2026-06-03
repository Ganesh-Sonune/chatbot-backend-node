import { LeadRequestDto }
from '../dto/lead-request.dto';

import { LeadResponseDto }
from '../dto/lead-response.dto';

import { Lead }
from '../entity/lead.entity';

export class LeadMapper {

  static toEntity(
    dto: LeadRequestDto,
  ): Lead {

    const lead =
      new Lead();

    lead.name =
      dto.name;

    lead.phone =
      dto.phone;

    lead.email =
      dto.email;

    lead.interestedIn =
      dto.interestedIn;

    lead.requestType =
      dto.requestType;

    return lead;
  }

  static toDTO(
    lead: Lead,
  ): LeadResponseDto {

    const dto =
      new LeadResponseDto();

    dto.id =
      lead.id;

    dto.name =
      lead.name;

    dto.phone =
      lead.phone;

    dto.email =
      lead.email;

    dto.interestedIn =
      lead.interestedIn;

    dto.requestType =
      lead.requestType;

    dto.status =
      lead.status;

    dto.createdAt =
      lead.createdAt;

    return dto;
  }
}