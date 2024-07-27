import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
  hash(data: string | Buffer, saltOrRounds: string | number): Promise<string> {
    return bcrypt.hash(data, saltOrRounds);
  }

  compare(password: string, storedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, storedPassword);
  }
}
