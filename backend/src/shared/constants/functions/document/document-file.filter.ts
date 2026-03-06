import { BadRequestException } from '@nestjs/common';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ALLOWED_DOCUMENT_MIME_TYPES } from './document-upload.constants';
export const documentFileFilter: MulterOptions['fileFilter'] = (
  _req,
  file,
  callback,
) => {
  if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(file.mimetype as any)) {
    return callback(new BadRequestException('Invalid file type'), false);
  }
  callback(null, true);
};