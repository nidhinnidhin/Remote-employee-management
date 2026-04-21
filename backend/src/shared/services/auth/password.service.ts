import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPasswordService } from './interfaces/ipassword.service';

@Injectable()
export class PasswordService implements IPasswordService {
  private readonly SALT_ROUNDS = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
