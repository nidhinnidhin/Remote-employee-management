import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { IInviteLinkRepository } from '../../domain/repositories/invite-link.repository';
import type { ILogger } from 'src/common/logger/interface/logger.interface';
import { LOGGER_SERVICE } from 'src/common/logger/tokens/logger.tokens';

@Injectable()
export class InviteLinkCleanupService {
  constructor(
    @Inject(LOGGER_SERVICE) private readonly logger: ILogger,
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
