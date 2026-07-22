import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: String,
    description: String,
    parentCategory: String,
    slug: String,
    avatar: String,
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
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

const PostCategory = mongoose.model('PostCategory', schema, "post-categories");

export default PostCategory;