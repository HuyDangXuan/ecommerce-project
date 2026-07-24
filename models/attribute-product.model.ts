import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: String,
    type: { // Kiểu hiển thị ra web
      type: String,
      enum: ["text", "select", "color"],
      default: "text"
    },
    options: [
      {
        label: String,
        value: String
      }
    ],
    search: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true, // Tự động sinh ra trường createdAt và updatedAt
  }
);

const AttributeProduct = mongoose.model('AttributeProduct', schema, "attributes-product");

export default AttributeProduct;
