import { IsEmail } from 'class-validator';

export class forgetPasswordDto {
  @IsEmail()
  email: string;
}
