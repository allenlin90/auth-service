import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModal: Model<User>) {}

  async findOne(...args: Parameters<Model<User>['findOne']>) {
    return this.UserModal.findOne(...args);
  }

  async create(...args: ConstructorParameters<Model<User>>) {
    const user = new this.UserModal(...args);

    return await user.save();
  }
}