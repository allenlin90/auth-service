import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { UserDto } from '../users/dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Serialize(UserDto)
  @Post('signup')
  async signup(@Body() signupData: SignupDto) {
    return this.authService.signup(signupData);
  }

  // TODO: POST login
  @Post('login')
  async login(@Body() credentials: LoginDto) {
    const { accessToken, refreshToken } =
      await this.authService.login(credentials);

    // TODO: set refresh token in cookie

    return { accessToken };
  }

  // TODO: POST refresh token
}
