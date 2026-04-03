import { IsEnum, IsNumber } from 'class-validator';
import { TaskStatus } from 'src/shared/enums/project/task-status.enum';

export class MoveTaskDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsNumber()
  order: number;
}
