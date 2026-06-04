import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: String,
    description: String,
    parentCategory: String,
    slug: String,
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', schema, "posts");

export default Post;