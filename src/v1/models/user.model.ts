import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      min: 5,
      max: 255,
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 100,
      select: false,
    },
    first_name: {
      type: String,
      min: 2,
    },
    last_name: {
      type: String,
      min: 2,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export default model('User', userSchema);