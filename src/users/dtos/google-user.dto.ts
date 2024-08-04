import { IsString } from 'class-validator';

export class GoogleUserDto {
  @IsString()
  id: string;

  @IsString()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  picture: string;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
