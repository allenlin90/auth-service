import { Injectable } from '@nestjs/common';

import { UsersRepository } from './users.repository';
import { SignupDTO } from '../auth/dtos/signup.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepository) {}

  findOneUserByEmail(email: string) {
    return this.usersRepo.findOne({ email });
  }

  create({ name, email, password }: SignupDTO) {
    return this.usersRepo.create({ name, email, password });
  }
}
