import { CloudinaryResourceType } from 'src/shared/enums/employees/media/cloudinary-resource.enum';

export interface EditDocumentInput {
  userId: string;
  documentId: string;
  name: string;
  category: string;
  file?: Express.Multer.File;
}

export interface UpdateDocumentPayload {
  name: string;
  category: string;
  fileUrl?: string;
  publicId?: string;
  resourceType?: CloudinaryResourceType;
}

export interface UserDocument {
  _id: string;
  name: string;
  category: string;
  fileUrl: string;
  publicId: string;
  resourceType: CloudinaryResourceType;
  uploadedAt: Date;
}

export interface EditDocumentResponse {
  message: string;
}
