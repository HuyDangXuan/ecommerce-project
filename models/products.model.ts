import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: String,
    description: String,
    content: String,
    category: [String],
    priceOld: Number,
    priceNew: Number,
    slug: String,
    images: [String],
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

const Products = mongoose.model('Products', schema, "products");

export default Products;