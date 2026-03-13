import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/iuser.repository';
import { CLOUDINARY_PATH } from 'src/shared/constants/path/cloudinary.path';
import { CloudinaryResourceType } from 'src/shared/enums/employees/media/cloudinary-resource.enum';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';
import {
  EditDocumentInput,
  UpdateDocumentPayload,
  UserDocument,
  EditDocumentResponse,
} from 'src/shared/types/profile/edit-document.type';
import { DOCUMENT_MESSAGES } from 'src/shared/constants/messages/profile/document.messages';
import type { IEditDocumentUseCase } from '../../interfaces/documents/document-use-case.interface';

@Injectable()
export class EditDocumentUseCase implements IEditDocumentUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    private readonly _cloudinaryService: CloudinaryService,
  ) { }

  async execute({
    userId,
    documentId,
    name,
    category,
    file,
  }: EditDocumentInput): Promise<EditDocumentResponse> {
    const update: UpdateDocumentPayload = { name, category };

    if (file) {
      const user = await this._userRepository.findById(userId);

      const existingDoc = user?.documents?.find(
        (doc: UserDocument) => doc._id.toString() === documentId,
      );

      if (existingDoc?.publicId) {
        await this._cloudinaryService.deleteFile(
          existingDoc.publicId,
          (existingDoc.resourceType as CloudinaryResourceType) ??
          CloudinaryResourceType.IMAGE,
        );
      }

      const uploadResult = await this._cloudinaryService.uploadFile(
        file,
        CLOUDINARY_PATH.UPLOAD_DOCUMENT_PATH,
      );

      update.fileUrl = uploadResult.secure_url;
      update.publicId = uploadResult.public_id;
      update.resourceType = uploadResult.resource_type as
        | CloudinaryResourceType
        | undefined;
    }

    await this._userRepository.updateDocument(userId, documentId, update);

    return {
      message: DOCUMENT_MESSAGES.DOCUMENT_UPDATE_SEUCCESS,
    };
  }
}
