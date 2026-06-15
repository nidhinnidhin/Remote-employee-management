import { BadRequestException } from '@nestjs/common';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ALLOWED_DOCUMENT_MIME_TYPES } from './document-upload.constants';
export const documentFileFilter: MulterOptions['fileFilter'] = (
  _req,
  file,
  callback,
) => {
  if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(file.mimetype as unknown as typeof ALLOWED_DOCUMENT_MIME_TYPES[number])) {
    return callback(new BadRequestException('Invalid file type'), false);
  }
  callback(null, true);
};