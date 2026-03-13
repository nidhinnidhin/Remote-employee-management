import { UploadDocumentInput, UploadDocumentResponse } from 'src/shared/types/profile/upload-document.type';
import { EditDocumentInput, EditDocumentResponse } from 'src/shared/types/profile/edit-document.type';
import { CloudinaryResourceType } from 'src/shared/enums/employees/media/cloudinary-resource.enum';

export interface IUploadDocumentUseCase {
    execute(input: UploadDocumentInput): Promise<UploadDocumentResponse>;
}

export interface IEditDocumentUseCase {
    execute(input: EditDocumentInput): Promise<EditDocumentResponse>;
}

export interface IDeleteDocumentUseCase {
    execute(userId: string, documentId: string, publicId: string, resourceType: CloudinaryResourceType): Promise<any>;
}
