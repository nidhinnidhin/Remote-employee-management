import { SetMetadata } from '@nestjs/common';
import { SystemRoles } from '../../types/roles/system-roles.enum';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: SystemRoles[]) =>
  SetMetadata(ROLES_KEY, roles);
