import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from './users.repository';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { ResetToken } from 'src/auth/schemas/reset-token.schema';
import { RefreshToken } from 'src/auth/schemas/refresh-token.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('deleteOne', async function () {
            const { _id: userId } = this.getQuery();
            const ResetTokenModel = this.model.db.model<ResetToken>(
              ResetToken.name,
            );
            const RefreshTokenModel = this.model.db.model<RefreshToken>(
              RefreshToken.name,
            );

            await ResetTokenModel.deleteMany({ userId });
            await RefreshTokenModel.deleteMany({ userId });
          });

          return schema;
        },
      },
    ]),
  ],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
