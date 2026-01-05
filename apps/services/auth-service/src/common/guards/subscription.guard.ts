import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from '../../modules/companies/company.entity';
import { SubscriptionStatus } from '../../types/company/subscription-status.enum';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const company = await this.companyRepo.findOne({
      where: { id: user.companyId },
    });

    if (!company) {
      throw new ForbiddenException('Company not found');
    }

    if (company.subscriptionStatus !== SubscriptionStatus.ACTIVE) {
      throw new ForbiddenException('Subscription is not active');
    }

    return true;
  }
}
