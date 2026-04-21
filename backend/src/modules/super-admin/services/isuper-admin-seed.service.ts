import { OnModuleInit } from '@nestjs/common';

export interface ISuperAdminSeedService extends OnModuleInit {
    onModuleInit(): Promise<void>;
}
