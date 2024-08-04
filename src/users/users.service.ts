import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { UsersRepository } from './users.repository';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepository) {}

  findOne(...args: Parameters<UsersRepository['findOne']>) {
    return this.usersRepo.findOne(...args);
  }

  findOneAndUpdate(...args: Parameters<UsersRepository['findOneAndUpdate']>) {
    return this.usersRepo.findOneAndUpdate(...args);
  }

  create(...args: ConstructorParameters<Model<User>>) {
    return this.usersRepo.create(...args);
  }
}
