import { RequestEmailChangeDto } from "src/modules/auth/application/dto/email-update/request-email-change.dto";
import { UpdateProfileDto } from "src/modules/auth/application/dto/update-profile.dto";


export interface IProfileRepository {
  getUserProfile(userId: string): Promise<any>;

  updateProfile(userId: string, input: UpdateProfileDto): Promise<any>;

  uploadProfileImage(userId: string, file: any): Promise<any>;

  updateSkills(userId: string, skills: string[]): Promise<any>;

  requestEmailChange(userId: string, input: RequestEmailChangeDto): Promise<any>;

  verifyEmailChange(userId: string, otp: string): Promise<any>;
}