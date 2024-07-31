import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ResetTokenDocument = HydratedDocument<ResetToken>;

@Schema({ versionKey: false, timestamps: true })
export class ResetToken {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: User.name })
  userId: string;

  @Prop({ required: true })
  expiryDate: Date;
}

export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken);
