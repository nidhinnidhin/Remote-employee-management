import { v2 as cloudinary } from 'cloudinary';
import { Injectable } from '@nestjs/common';
import { CloudinaryResourceType } from '../../enums/employees/media/cloudinary-resource.enum';
import { ICloudinaryService } from './interfaces/icloudinary.service';

@Injectable()
export class CloudinaryService implements ICloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'employee-management/documents',
            resource_type: 'auto', // 🔥 REQUIRED for PDF/DOC
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async deleteFile(
    publicId: string,
    resourceType?: CloudinaryResourceType,
  ) {
    return cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  }
}
