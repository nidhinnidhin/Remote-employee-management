import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from 'src/modules/auth/domain/repositories/user.repository';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';

@Injectable()
export class EditDocumentUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(
    userId: string,
    documentId: string,
    name: string,
    category: string,
    file?: Express.Multer.File,
  ) {
    const update: {
      name: string;
      category: string;
      fileUrl?: string;
      publicId?: string;
      resourceType?: string;
    } = { name, category };

    if (file) {
      const user = await this.userRepository.findById(userId);
      const existingDoc = user?.documents?.find(
        (d: any) => d._id.toString() === documentId,
      );

      if (existingDoc?.publicId) {
        try {
          await this.cloudinaryService.deleteFile(
            existingDoc.publicId,
            (existingDoc as any).resourceType ?? 'image',
          );
        } catch {
          console.warn('Failed to delete old Cloudinary file');
        }
      }

      const uploadResult = await this.cloudinaryService.uploadFile(
        file,
        'employee-management/documents',
      );

      update.fileUrl = uploadResult.secure_url;
      update.publicId = uploadResult.public_id;
      update.resourceType = uploadResult.resource_type;
    }

    await this.userRepository.updateDocument(userId, documentId, update);
    return { message: 'Document updated successfully' };
  }
}
