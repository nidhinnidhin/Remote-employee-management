import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from 'src/modules/auth/domain/repositories/iuser.repository';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { PROFILE_MESSAGES } from 'src/shared/constants/messages/profile/profile.messages';
import { CLOUDINARY_PATH } from 'src/shared/constants/path/cloudinary.path';
import type { ICloudinaryService } from 'src/shared/services/cloudinary/interfaces/icloudinary.service';
import { IUploadProfileImageUseCase } from '../../interfaces/profile/profile-use-case.interface';

@Injectable()
export class UploadProfileImageUseCase implements IUploadProfileImageUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,

    @Inject('ICloudinaryService')
    private readonly _cloudinaryService: ICloudinaryService,
  ) { }

  async execute(userId: string, file: Express.Multer.File) {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    if (user.profileImagePublicId) {
      await this._cloudinaryService.deleteFile(user.profileImagePublicId);
    }

    const uploadResult = await this._cloudinaryService.uploadFile(
      file,
      CLOUDINARY_PATH.UPLOAD_DOCUMENT_PATH,
    );

    await this._userRepository.updateProfileImage(
      userId,
      uploadResult.secure_url,
      uploadResult.public_id,
    );

    return {
      message: PROFILE_MESSAGES.PROFILE_IMAGE_UPLOADED,
      imageUrl: uploadResult.secure_url,
    };
  }
}
