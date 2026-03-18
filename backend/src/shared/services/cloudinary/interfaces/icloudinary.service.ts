import { CloudinaryResourceType } from '../../../enums/employees/media/cloudinary-resource.enum';

export interface ICloudinaryService {
  uploadFile(file: Express.Multer.File, folder: string): Promise<any>;
  deleteFile(publicId: string, resourceType?: CloudinaryResourceType): Promise<any>;
}
