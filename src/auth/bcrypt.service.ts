import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  hash(data: string | Buffer, saltOrRounds: string | number): Promise<string> {
    return bcrypt.hash(data, saltOrRounds);
  }
}
