import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from './schemas/refresh-token.schema';

export class AuthRepository {
  constructor(
    private config: ConfigService,
    @InjectModel(RefreshToken.name)
    private RefreshTokenModel: Model<RefreshToken>,
  ) {}

  async createRefreshToken(userId: string, token: string) {
    const expiryDate = new Date();
    const expiresIn = this.config.get<number>('refreshToken.expiresIn');
    expiryDate.setDate(expiryDate.getDate() + expiresIn);

    const refreshToken = await this.RefreshTokenModel.create({
      userId,
      token,
      expiryDate,
    });

    return refreshToken;
  }

  async findOneAndDeleteRefreshToken(
    ...args: Parameters<(typeof Model<RefreshToken>)['findOneAndDelete']>
  ) {
    return this.RefreshTokenModel.findOneAndDelete(...args);
  }
}
