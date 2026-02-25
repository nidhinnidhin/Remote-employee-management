import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from 'src/modules/auth/domain/repositories/user.repository';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';

@Injectable()
export class UploadDocumentUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(
    userId: string,
    file: Express.Multer.File,
    name: string,
    category: string,
  ) {
    const upload = await this.cloudinaryService.uploadFile(
      file,
      'employee-management/documents',
    );

    const document = {
      name,
      category,
      fileUrl: upload.secure_url,
      publicId: upload.public_id,
      uploadedAt: new Date(),
    };

    await this.userRepository.addDocument(userId, document);

    return {
      message: 'Document uploaded successfully',
      document,
    };
  }
}
