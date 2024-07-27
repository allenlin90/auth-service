import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupDto } from './dtos/Signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
}
