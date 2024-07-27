import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignupDto } from './dtos/Signup.dto';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private UserModal: Model<User>) {}

  async signup(signupData: SignupDto) {
    const { email, password, name } = signupData;
    const emailInUse = await this.UserModal.findOne({ email });

    if (emailInUse) {
      throw new BadRequestException('email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.UserModal.create({
      name,
      email,
      password: hashedPassword,
    });
  }
}
