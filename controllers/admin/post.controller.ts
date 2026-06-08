import { Request, Response } from 'express'
import Post from '../../models/posts.model'
import Category from '../../models/categories.model'
import buildCategoryTree from '../../helpers/category.helper'

export const GETpostList = async (req: Request, res: Response) => {
  const posts: any = await Post.find({ deleted: false }).sort({ createdAt: "desc" });

  for (const item of posts) {
    if (item.parentCategory) {
      const parent = await Category.findById(item.parentCategory);
      item.parentName = parent ? parent.name : "Không có";
    }
  }

  res.render('admin/pages/posts/post-list', {
    title: 'Danh sách bài viết',
    posts: posts
  })
}

export const GETcreatePost = async (req: Request, res: Response) => {
  const categories = await Category.find();
  const categoryTree = buildCategoryTree(categories, "");

  res.render('admin/pages/posts/post-create', {
    title: 'Tạo bài viết',
    categories: categoryTree
  })
}

export const POSTcreatePost = async (req: Request, res: Response) => {
  try {
    const existingCategory = await Category.findOne({ slug: req.body.slug });
    if (existingCategory) {
      res.json({
        code: "error",
        message: "Slug đã tồn tại, vui lòng chọn slug khác",
      });
      return;
    }

    const newRecord = new Post(req.body);
    await newRecord.save();

    res.json({
      code: "success",
      message: "Bài viết đã được tạo thành công",
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ",
    })
  }
}

export const GETcategoryList = async (req: Request, res: Response) => {
  const categories: any = await Category.find({ deleted: false }).sort({ createdAt: "desc" });

  for (const item of categories) {
    if (item.parentCategory) {
      const parent = await Category.findById(item.parentCategory);
      item.parentName = parent ? parent.name : "Không có";
    }
  }

  res.render('admin/pages/posts/category-list', {
    title: 'Danh sách danh mục',
    categories: categories
  })
}

export const GETcreateCategory = async (req: Request, res: Response) => {
  const categories = await Category.find();
  const categoryTree = buildCategoryTree(categories, "");

  res.render('admin/pages/posts/category-create', {
    title: 'Tạo danh mục bài viết',
    categories: categoryTree
  })
}

export const POSTcreateCategory = async (req: Request, res: Response) => {
  try {
    const existingCategory = await Category.findOne({ slug: req.body.slug });
    if (existingCategory) {
      res.json({
        code: "error",
        message: "Slug đã tồn tại, vui lòng chọn slug khác",
      });
      return;
    }

    const newRecord = new Category(req.body);
    await newRecord.save();

    res.json({
      code: "success",
      message: "Danh mục đã được tạo thành công",
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ",
    })
  }
}