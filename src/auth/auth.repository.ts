import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken } from './schemas/refresh-token.schema';

export class AuthRepository {
  constructor(
    @InjectModel(RefreshToken.name)
    private RefreshTokenModel: Model<RefreshToken>,
  ) {}

  async createRefreshToken(userId: string, token: string) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const refreshToken = await this.RefreshTokenModel.create({
      userId,
      token,
      expiryDate,
    });

    return refreshToken.token;
  }
}
