import { Inject, Injectable } from "@nestjs/common";
import type { UserRepository } from "src/modules/auth/domain/repositories/user.repository";
import { CloudinaryService } from "src/shared/services/cloudinary.service";

@Injectable()
export class DeleteDocumentUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(userId: string, documentId: string, publicId: string) {
    await this.cloudinaryService.deleteFile(publicId);
    await this.userRepository.removeDocument(userId, documentId);

    return { message: 'Document deleted successfully' };
  }
}