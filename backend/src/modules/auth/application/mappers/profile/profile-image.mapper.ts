// src/modules/.../infrastructure/mappers/profile-image.mapper.ts

import { UserEntity } from "../../../domain/entities/user.entity";

export class ProfileImageMapper {
  /**
   * Maps Cloudinary upload results to a Partial Domain Entity payload.
   */
  static toUpdatePayload(imageUrl: string, publicId: string): Partial<UserEntity> {
    return {
      profileImageUrl: imageUrl,
      profileImagePublicId: publicId,
    };
  }

  /**
   * Generates a payload to clear the image fields when an image is deleted.
   */
  static toDeletePayload(): Partial<UserEntity> {
    return {
      profileImageUrl: undefined,
      profileImagePublicId: undefined,
    };
  }
}