import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: String,
    description: String,
    content: String,
    category: [String],
    slug: String,
    avatar: String,
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
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
    publishedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', schema, "posts");

export default Post;