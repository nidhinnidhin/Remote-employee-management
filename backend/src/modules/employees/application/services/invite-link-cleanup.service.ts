import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { IInviteLinkRepository } from '../../domain/repositories/invite-link.repository';

@Injectable()
export class InviteLinkCleanupService {
  private readonly logger = new Logger(InviteLinkCleanupService.name);

  constructor(
    @Inject('IInviteLinkRepository')
    private readonly _inviteLinkRepo: IInviteLinkRepository,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCleanup() {
    this.logger.debug('Running expired invite tokens cleanup job...');
    try {
      const deletedCount = await this._inviteLinkRepo.deleteExpiredTokens();
      if (deletedCount > 0) {
        this.logger.log(`Deleted ${deletedCount} expired invite tokens.`);
      } else {
        this.logger.debug('No expired tokens found to delete.');
      }
    } catch (error) {
      this.logger.error(
        'Error occurred while cleaning up expired tokens:',
        error,
      );
    }
  }
}
