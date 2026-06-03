import { TrainerRequestDto }
from '../dto/trainer-request.dto';

import { TrainerResponseDto }
from '../dto/trainer-response.dto';

import { Trainer }
from '../entity/trainer.entity';

export class TrainerMapper {

  static toEntity(
    dto: TrainerRequestDto,
  ): Trainer {

    const trainer =
      new Trainer();

    trainer.name =
      dto.name;

    trainer.email =
      dto.email;

    trainer.phone =
      dto.phone;

    trainer.specialization =
      dto.specialization;

    trainer.experience =
      dto.experience;

    trainer.courseName =
      dto.courseName;

    trainer.status =
      dto.status;

    return trainer;
  }

  static toDTO(
    trainer: Trainer,
  ): TrainerResponseDto {

    return new TrainerResponseDto(

      trainer.id,

      trainer.name,

      trainer.email,

      trainer.specialization,

      trainer.experience,

      trainer.courseName,

      trainer.status,
    );
  }
}