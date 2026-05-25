// src/modules/meeting/application/dto/add-participants.dto.ts
import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class AddParticipantsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  participants: string[];
}
