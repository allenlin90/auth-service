import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

type HashFunction = typeof bcrypt.hash;

@Injectable()
export class BcryptService {
  hash(data: string | Buffer, saltOrRounds: string | number): Promise<string> {
    return bcrypt.hash(data, saltOrRounds);
  }
}
