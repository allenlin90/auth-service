import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from './schemas/refresh-token.schema';
import { ResetToken } from './schemas/reset-token.schema';

export class AuthRepository {
  constructor(
    @InjectModel(RefreshToken.name)
    private RefreshTokenModel: Model<RefreshToken>,
    @InjectModel(ResetToken.name)
    private ResetTokenModel: Model<ResetToken>,
  ) {}

  async createResetToken(doc: ResetToken) {
    const resetToken = await this.ResetTokenModel.create(doc);
    return resetToken;
  }

  async createRefreshToken(doc: RefreshToken) {
    const refreshToken = await this.RefreshTokenModel.create(doc);
    return refreshToken;
  }

  async findOneAndDeleteRefreshToken(
    ...args: Parameters<(typeof Model<RefreshToken>)['findOneAndDelete']>
  ) {
    return this.RefreshTokenModel.findOneAndDelete(...args);
  }

  async findOneAndDeleteResetToken(
    ...args: Parameters<(typeof Model<ResetToken>)['findOneAndDelete']>
  ) {
    return this.ResetTokenModel.findOneAndDelete(...args);
  }
}
