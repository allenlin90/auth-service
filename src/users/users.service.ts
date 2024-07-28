import { Injectable } from '@nestjs/common';

import { UsersRepository } from './users.repository';
import { SignupDto } from '../auth/dtos/signup.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepository) {}

  findOne(...args: Parameters<UsersRepository['findOne']>) {
    return this.usersRepo.findOne(...args);
  }

  findOneAndUpdate(...args: Parameters<UsersRepository['findOneAndUpdate']>) {
    return this.usersRepo.findOneAndUpdate(...args);
  }

  create({ name, email, password }: SignupDto) {
    return this.usersRepo.create({ name, email, password });
  }
}
