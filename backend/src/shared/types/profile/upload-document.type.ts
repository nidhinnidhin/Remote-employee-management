import { CloudinaryResourceType } from 'src/shared/enums/employees/media/cloudinary-resource.enum';

export interface UploadDocumentInput {
  userId: string;
  file: Express.Multer.File;
  name: string;
  category: string;
}

export interface NewDocument {
  name: string;
  category: string;
  fileUrl: string;
  publicId: string;
  resourceType: CloudinaryResourceType;
  uploadedAt: Date;
}

export interface UploadDocumentResponse {
  message: string;
  document: NewDocument | null;
}

export interface User {
  _id: string;
  documents: NewDocument[];
}