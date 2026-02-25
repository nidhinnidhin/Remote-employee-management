import { Inject, Injectable } from "@nestjs/common";
import type { UserRepository } from "src/modules/auth/domain/repositories/user.repository";

@Injectable()
export class EditDocumentUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string, documentId: string, name: string, category: string) {
    await this.userRepository.updateDocument(userId, documentId, {
      name,
      category,
    });

    return { message: 'Document updated successfully' };
  }
}