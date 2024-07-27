import { Injectable } from '@nestjs/common';

import { UsersRepository } from './users.repository';
import { SignupDto } from '../auth/dtos/signup.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepository) {}

  findOneByEmail(email: string) {
    return this.usersRepo.findOne({ email });
  }

  create({ name, email, password }: SignupDto) {
    return this.usersRepo.create({ name, email, password });
  }
}
