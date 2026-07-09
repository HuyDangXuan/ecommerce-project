import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: String,
    description: String,
    permissions: [String],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
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

const Role = mongoose.model('Role', schema, "roles");

export default Role;