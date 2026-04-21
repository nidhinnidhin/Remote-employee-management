import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/iuser.repository';
import { DOCUMENT_MESSAGES } from 'src/shared/constants/messages/profile/document.messages';
import { CLOUDINARY_PATH } from 'src/shared/constants/path/cloudinary.path';
import type { ICloudinaryService } from 'src/shared/services/cloudinary/interfaces/icloudinary.service';
import {
  UploadDocumentInput,
  NewDocument,
  UploadDocumentResponse,
} from 'src/shared/types/profile/upload-document.type';
import { CloudinaryResourceType } from 'src/shared/enums/employees/media/cloudinary-resource.enum';
import type { IUploadDocumentUseCase } from '../../interfaces/documents/document-use-case.interface';

@Injectable()
export class UploadDocumentUseCase implements IUploadDocumentUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    @Inject('ICloudinaryService')
    private readonly _cloudinaryService: ICloudinaryService,
  ) { }

  async execute({
    userId,
    file,
    name,
    category,
  }: UploadDocumentInput): Promise<UploadDocumentResponse> {
    const uploadResult = await this._cloudinaryService.uploadFile(
      file,
      CLOUDINARY_PATH.UPLOAD_DOCUMENT_PATH,
    );

    const document: NewDocument = {
      name,
      category,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      resourceType: uploadResult.resource_type as CloudinaryResourceType,
      uploadedAt: new Date(),
    };

    await this._userRepository.addDocument(userId, document);

    const updatedUser = await this._userRepository.findById(userId);

    if (!updatedUser) {
      throw new Error(DOCUMENT_MESSAGES.USER_NOT_FOUND_AFTER_DOCUMENT_UPLOAD);
    }

    const rawDocument =
      updatedUser.documents?.[updatedUser.documents.length - 1] ?? null;

    const savedDocument: NewDocument | null = rawDocument
      ? {
        ...rawDocument,
        resourceType: rawDocument.resourceType as CloudinaryResourceType,
      }
      : null;

    return {
      message: DOCUMENT_MESSAGES.DOCUMENT_UPLOADED,
      document: savedDocument,
    };
  }
}
