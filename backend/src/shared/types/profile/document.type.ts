import { CloudinaryResourceType } from 'src/shared/enums/employees/media/cloudinary-resource.enum';

export interface DocumentPayload {
  name: string;
  category: string;
  fileUrl?: string;
  publicId?: string;
  resourceType?: CloudinaryResourceType;
  uploadedAt?: Date;
}