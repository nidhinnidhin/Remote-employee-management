import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { CreateSubscriptionPlanDto } from '../../application/dtos/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from '../../application/dtos/update-subscription-plan.dto';
import type {
  ICreateSubscriptionPlanUseCase,
  IGetAllSubscriptionPlansUseCase,
  IUpdateSubscriptionPlanUseCase,
  IDeleteSubscriptionPlanUseCase,
} from '../../application/interfaces/subscription-plan.use-case.interface';

@Controller('subscription-plans')
export class SubscriptionPlanController {
  constructor(
    @Inject('ICreateSubscriptionPlanUseCase')
    private readonly _createUseCase: ICreateSubscriptionPlanUseCase,
    @Inject('IGetAllSubscriptionPlansUseCase')
    private readonly _getAllUseCase: IGetAllSubscriptionPlansUseCase,
    @Inject('IUpdateSubscriptionPlanUseCase')
    private readonly _updateUseCase: IUpdateSubscriptionPlanUseCase,
    @Inject('IDeleteSubscriptionPlanUseCase')
    private readonly _deleteUseCase: IDeleteSubscriptionPlanUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateSubscriptionPlanDto) {
    return this._createUseCase.execute(dto);
  }

  @Get()
  findAll() {
    return this._getAllUseCase.execute();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSubscriptionPlanDto) {
    return this._updateUseCase.execute(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._deleteUseCase.execute(id);
  }
}
