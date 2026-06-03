import { FaqRequestDto }
from '../dto/faq-request.dto';

import { FaqResponseDto }
from '../dto/faq-response.dto';

import { FaqEntry }
from '../entity/faq-entry.entity';

export class FaqMapper {

  static toEntity(
    dto: FaqRequestDto,
  ): FaqEntry {

    const faq =
      new FaqEntry();

    faq.question =
      dto.question;

    faq.answer =
      dto.answer;

    faq.status =
      dto.status;

    return faq;
  }

  static toDTO(
    faq: FaqEntry,
  ): FaqResponseDto {

    return new FaqResponseDto(

      faq.id,

      faq.question,

      faq.answer,

      faq.status,
    );
  }
}