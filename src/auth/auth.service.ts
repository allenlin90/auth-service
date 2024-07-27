import { BadRequestException, Injectable } from '@nestjs/common';

import { UsersRepository } from './users.repository';
import { SignupDto } from './dtos/Signup.dto';
import { BcryptService } from './bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private usersRepo: UsersRepository,
    private bcryptService: BcryptService,
  ) {}

  async signup(signupData: SignupDto) {
    const { email, password, name } = signupData;
    const emailInUse = await this.usersRepo.findOne({ email });

    if (emailInUse) {
      throw new BadRequestException('email in use');
    }

    const hashedPassword = await this.bcryptService.hash(password, 10);

    await this.usersRepo.create({
      name,
      email,
      password: hashedPassword,
    });
  }
}
