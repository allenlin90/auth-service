import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDTO } from './dtos/signup.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDTO } from '../users/dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Serialize(UserDTO)
  @Post('signup')
  async signup(@Body() signupData: SignupDTO) {
    return this.authService.signup(signupData);
  }

  // TODO: POST login

  // TODO: POST refresh token
}
