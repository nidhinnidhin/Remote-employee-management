import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { UserRepository } from 'src/modules/auth/domain/repositories/user.repository';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';

@Injectable()
export class UploadProfileImageUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(userId: string, file: Express.Multer.File) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // ✅ Delete old image if exists
    if (user.profileImagePublicId) {
      await this.cloudinaryService.deleteFile(user.profileImagePublicId);
    }

    // ✅ Use new method
    const uploadResult = await this.cloudinaryService.uploadFile(
      file,
      'employee-management/profile-images',
    );

    await this.userRepository.updateProfileImage(
      userId,
      uploadResult.secure_url,
      uploadResult.public_id,
    );

    return {
      message: 'Profile image uploaded successfully',
      imageUrl: uploadResult.secure_url,
    };
  }
}
