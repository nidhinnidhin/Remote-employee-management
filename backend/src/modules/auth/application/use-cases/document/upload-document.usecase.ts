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
    const uploadResult = await this.cloudinaryService.uploadFile(
      file,
      'employee-management/documents',
    );

    const document = {
      name,
      category,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      resourceType: uploadResult.resource_type, // ← add this ('image' or 'raw')
      uploadedAt: new Date(),
    };

    await this.userRepository.addDocument(userId, document);

    const updatedUser = await this.userRepository.findById(userId);
    if (!updatedUser) throw new Error('User not found after document upload');

    const savedDocument =
      updatedUser.documents && updatedUser.documents.length > 0
        ? updatedUser.documents[updatedUser.documents.length - 1]
        : null;

    return {
      message: 'Document uploaded successfully',
      document: savedDocument, // now includes _id + resourceType
    };
  }
}
