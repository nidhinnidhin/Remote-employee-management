import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { SubscriptionService } from 'src/modules/subscription/application/services/subscription.service';
import type { IProjectRepository } from 'src/modules/project/domain/repositories/project.repository.interface';
import type { IUserRepository } from 'src/modules/auth/domain/repositories/iuser.repository';
import { UserRole } from 'src/shared/enums/user/user-role.enum';
import { Reflector } from '@nestjs/core';

@Injectable()
export class SubscriptionLimitGuard implements CanActivate {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly reflector: Reflector,
    @Inject('IProjectRepository')
    private readonly _projectRepository: IProjectRepository,
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      if (!user || !user.companyId) return true;

      const limitType = this.reflector.get<string>('subscriptionLimitType', context.getHandler());
      if (!limitType) return true;

      console.log(`[SubscriptionLimitGuard] Checking limit for ${limitType} in company ${user.companyId}`);

      if (limitType === 'projects') {
        const projects = await this._projectRepository.findAllByCompanyId(user.companyId);
        await this.subscriptionService.checkLimit(user.companyId, 'maxProjects', projects.length);
      } else if (limitType === 'members') {
        const members = await this._userRepository.findAllByCompanyIdAndRole(user.companyId, UserRole.EMPLOYEE);
        await this.subscriptionService.checkLimit(user.companyId, 'maxMembers', members.length);
      }

      return true;
    } catch (error) {
      console.error('[SubscriptionLimitGuard] Error:', error);
      throw error;
    }
  }
}
