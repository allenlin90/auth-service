import { IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*\d)/, {
    message: 'password must contain at least one number',
  })
  newPassword: string;

  @IsString()
  confirmNewPassword: string;
}
