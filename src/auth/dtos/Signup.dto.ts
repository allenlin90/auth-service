import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*\d)/, {
    message: 'password must contain at least one number',
  })
  password: string;

  @IsString()
  @IsOptional()
  googleId?: string;
}
