import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/Signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
}
