import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from 'src/modules/auth/domain/repositories/user.repository';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';

@Injectable()
export class DeleteDocumentUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private getResourceType(publicId: string): 'image' | 'raw' {
    const rawExtensions = ['pdf', 'doc', 'docx'];
    const ext = publicId.split('.').pop()?.toLowerCase() ?? '';
    return rawExtensions.includes(ext) ? 'raw' : 'image';
  }

  async execute(
    userId: string,
    documentId: string,
    publicId: string,
    resourceType: 'image' | 'raw' | 'video',
  ) {
    await this.cloudinaryService.deleteFile(publicId, resourceType);
    await this.userRepository.removeDocument(userId, documentId);
    return { message: 'Document deleted successfully' };
  }
}
