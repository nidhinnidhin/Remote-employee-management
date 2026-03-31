import { RequestEmailChangeDto } from "src/modules/auth/application/dto/email-update/request-email-change.dto";
import { UpdateProfileDto } from "src/modules/auth/application/dto/update-profile.dto";


export interface IProfileRepository {
  getUserProfile(userId: string): Promise<unknown>;

  updateProfile(userId: string, input: UpdateProfileDto): Promise<unknown>;

  uploadProfileImage(userId: string, file: Express.Multer.File): Promise<unknown>;

  updateSkills(userId: string, skills: string[]): Promise<unknown>;

  requestEmailChange(userId: string, input: RequestEmailChangeDto): Promise<unknown>;

  verifyEmailChange(userId: string, otp: string): Promise<unknown>;
}