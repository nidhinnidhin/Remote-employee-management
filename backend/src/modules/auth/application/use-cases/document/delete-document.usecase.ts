import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/iuser.repository';
import { DOCUMENT_MESSAGES } from 'src/shared/constants/messages/profile/document.messages';
import { CloudinaryResourceType } from 'src/shared/enums/employees/media/cloudinary-resource.enum';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';
import type { IDeleteDocumentUseCase } from '../../interfaces/auth-use-cases.interfaces';

@Injectable()
export class DeleteDocumentUseCase implements IDeleteDocumentUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    private readonly _cloudinaryService: CloudinaryService,
  ) { }

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
