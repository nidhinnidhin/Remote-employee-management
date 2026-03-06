import {
    Body,
    Controller,
    Delete,
    Param,
    Patch,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    BadRequestException,
} from '@nestjs/common';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CloudinaryResourceType } from 'src/shared/enums/employees/media/cloudinary-resource.enum';
import { UploadDocumentUseCase } from '../../application/use-cases/document/upload-document.usecase';
import { DeleteDocumentUseCase } from '../../application/use-cases/document/delete-document.usecase';
import { EditDocumentUseCase } from '../../application/use-cases/document/edit-document.usecase';

// ─── Constants ───────────────────────────────────────────────────────────────

const DOCUMENT_FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB

const ALLOWED_DOCUMENT_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
];

const documentFileFilter: MulterOptions['fileFilter'] = (
    _req,
    file,
    callback,
) => {
    if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(file.mimetype)) {
        return callback(new BadRequestException('Invalid file type'), false);
    }
    callback(null, true);
};

const documentInterceptor = FileInterceptor('file', {
    limits: { fileSize: DOCUMENT_FILE_SIZE_LIMIT },
    fileFilter: documentFileFilter,
});

@Controller('auth/documents')
@UseGuards(JwtAuthGuard)
export class DocumentController {
    constructor(
        private readonly uploadDocumentUseCase: UploadDocumentUseCase,
        private readonly deleteDocumentUseCase: DeleteDocumentUseCase,
        private readonly editDocumentUseCase: EditDocumentUseCase,
    ) { }

    @Post()
    @UseInterceptors(documentInterceptor)
    async uploadDocument(
        @Req() req: Request,
        @UploadedFile() file: Express.Multer.File,
        @Body('name') name: string,
        @Body('category') category: string,
    ) {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        return this.uploadDocumentUseCase.execute({
            userId: req.user!.userId,
            file,
            name,
            category,
        });
    }

    @Delete(':id')
    async deleteDocument(
        @Req() req: Request,
        @Param('id') documentId: string,
        @Body('publicId') publicId: string,
        @Body('resourceType') resourceType: CloudinaryResourceType,
    ) {
        return this.deleteDocumentUseCase.execute(
            req.user!.userId,
            documentId,
            publicId,
            resourceType,
        );
    }

    @Patch(':id')
    @UseInterceptors(documentInterceptor)
    async editDocument(
        @Req() req: Request,
        @Param('id') documentId: string,
        @Body('name') name: string,
        @Body('category') category: string,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return this.editDocumentUseCase.execute({
            userId: req.user!.userId,
            documentId,
            name,
            category,
            file,
        });
    }
}
