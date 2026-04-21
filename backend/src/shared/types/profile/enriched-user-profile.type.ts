import { UserEntity } from 'src/modules/auth/domain/entities/user.entity';

/**
 * The enriched user profile returned by GetUserProfileUseCase.
 * Extends UserEntity fields with a list of all department names
 * the user belongs to (resolved via IDepartmentRepository).
 */
export interface EnrichedUserProfile extends Omit<UserEntity, 'passwordHash'> {
  departments: string[];
}
