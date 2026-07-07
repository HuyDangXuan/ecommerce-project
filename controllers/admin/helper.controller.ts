import { Request, Response } from "express";
import slugify from "slugify";
import Post from "../../models/posts.model";
import Category from "../../models/categories.model";
import { generateRandomString } from "../../helpers/generate.helper";

// Khai báo map modelName với model tương ứng
const modelMap: any = {
  Post: Post,
  Category: Category,
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