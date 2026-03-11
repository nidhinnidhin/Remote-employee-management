import {
  UploadDocumentInput,
  UploadDocumentResponse,
} from 'src/shared/types/profile/upload-document.type';

import {
  EditDocumentInput,
  EditDocumentResponse,
} from 'src/shared/types/profile/edit-document.type';

import { CloudinaryResourceType } from 'src/shared/enums/employees/media/cloudinary-resource.enum';

export interface IDocumentRepository {
  uploadDocument(input: UploadDocumentInput): Promise<UploadDocumentResponse>;

  editDocument(input: EditDocumentInput): Promise<EditDocumentResponse>;

  deleteDocument(
    userId: string,
    documentId: string,
    publicId: string,
    resourceType: CloudinaryResourceType,
  ): Promise<any>;
}