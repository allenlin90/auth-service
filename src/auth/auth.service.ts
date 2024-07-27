import { BadRequestException, Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { SignupDTO } from './dtos/signup.dto';
import { BcryptService } from './bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private bcryptService: BcryptService,
  ) {}

  async signup(signupData: SignupDTO) {
    const { email, password, name } = signupData;
    const emailInUse = await this.usersService.findOneByEmail(email);

    if (emailInUse) {
      throw new BadRequestException('email in use');
    }

    const hashedPassword = await this.bcryptService.hash(password, 10);

    return await this.usersService.create({
      name,
      email,
      password: hashedPassword,
    });
  }
}
