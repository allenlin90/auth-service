import { IsString, MinLength, IsUUID, Matches } from 'class-validator';
import { Match } from '../../decorators/match.decorator';

export class ResetPasswordDto {
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*\d)/, {
    message: 'password must contain at least one number',
  })
  password: string;

  @IsString()
  @Match('password', { message: 'passwords do not match' })
  confirmPassword: string;

  @IsString()
  @IsUUID()
  token: string;
}
