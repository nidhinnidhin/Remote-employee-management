import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from 'src/modules/auth/domain/repositories/user.repository';
import { DOCUMENT_MESSAGES } from 'src/shared/constants/messages/profile/document.messages';
import { CloudinaryResourceType } from 'src/shared/enums/employees/media/cloudinary-resource.enum';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';

@Injectable()
export class DeleteDocumentUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly _userRepository: UserRepository,
    private readonly _cloudinaryService: CloudinaryService,
  ) {}

  async execute(
    userId: string,
    documentId: string,
    publicId: string,
    resourceType: CloudinaryResourceType,
  ) {
    await this._cloudinaryService.deleteFile(publicId, resourceType);
    await this._userRepository.removeDocument(userId, documentId);
    return { message: DOCUMENT_MESSAGES.SUCCESS_DOCUMENT_DELETE };
  }
}
