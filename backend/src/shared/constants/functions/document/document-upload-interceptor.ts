import { FileInterceptor } from '@nestjs/platform-express';
import { documentFileFilter } from './document-file.filter';
import { DOCUMENT_FILE_SIZE_LIMIT } from './document-upload.constants';

export const documentInterceptor = FileInterceptor('file', {
  limits: { fileSize: DOCUMENT_FILE_SIZE_LIMIT },
  fileFilter: documentFileFilter,
});