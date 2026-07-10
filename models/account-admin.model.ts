import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    status: {
      type: String,
      enum: ['initial', 'active', 'inactive'],
      default: 'initial',
    },
    avatar: String,
    roles: [String],
    
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    search: String,
  },
  {
    timestamps: true,
  }
);

const AccountAdmin = mongoose.model('AccountAdmin', schema, "account-admin");

export default AccountAdmin;