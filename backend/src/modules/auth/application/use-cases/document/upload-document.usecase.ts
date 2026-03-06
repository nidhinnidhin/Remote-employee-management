import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from 'src/modules/auth/domain/repositories/user.repository';
import { DOCUMENT_MESSAGES } from 'src/shared/constants/messages/profile/document.messages';
import { CLOUDINARY_PATH } from 'src/shared/constants/path/cloudinary.path';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';
import {
  UploadDocumentInput,
  NewDocument,
  UploadDocumentResponse,
} from 'src/shared/types/profile/upload-document.type';
import { CloudinaryResourceType } from 'src/shared/enums/employees/media/cloudinary-resource.enum';

@Injectable()
export class UploadDocumentUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute({
    userId,
    file,
    name,
    category,
  }: UploadDocumentInput): Promise<UploadDocumentResponse> {
    const uploadResult = await this.cloudinaryService.uploadFile(
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

    await this.userRepository.addDocument(userId, document);

    const updatedUser = await this.userRepository.findById(userId);

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
