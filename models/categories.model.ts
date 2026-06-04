import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: String,
    description: String,
    parentCategory: String,
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', schema, "post-categories");

export default Category;