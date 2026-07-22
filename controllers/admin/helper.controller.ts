import { Request, Response } from "express";
import slugify from "slugify";
import Post from "../../models/posts.model";
import PostCategory from "../../models/post-categories.model";
import Product from "../../models/products.model";
import ProductCategory from "../../models/product-categories.model";
import { generateRandomString } from "../../helpers/generate.helper";

// Khai báo map modelName với model tương ứng
const modelMap: any = {
  Post: Post,
  PostCategory: PostCategory,
  Product: Product,
  ProductCategory: ProductCategory
};

export const POSTgenerateSlug = async (req: Request, res: Response) => {
  const { string, model } = req.body;

  const Model = modelMap[model];

  let slug = slugify(string, {
    lower: true,
    replacement: '-',
    strict: true,
  })

  const existSlug = await Model.findOne({ slug: slug });

  if (existSlug) {
    slug = `${slug}-${generateRandomString(4)}`
  }

  res.json({
    code: "success",
    message: "Slug đã được tạo thành công",
    slug: slug
  })
}