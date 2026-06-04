import { Request, Response } from 'express'
import Post from '../../models/posts.model'
import Category from '../../models/categories.model'
import buildCategoryTree from '../../helpers/category.helper'

export const GETpostList = (req: Request, res: Response) => {
  res.render('admin/pages/posts/post-list', {
    title: 'Danh sách bài viết',
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
  const newRecord = new Post(req.body);
  await newRecord.save();

  res.json({
    code: "success",
    message: "Bài viết đã được tạo thành công",
  })
}

export const GETcategoryList = (req: Request, res: Response) => {
  res.render('admin/pages/posts/category-list', {
    title: 'Danh sách danh mục',
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
  const newRecord = new Category(req.body);
  await newRecord.save();

  res.json({
    code: "success",
    message: "Danh mục đã được tạo thành công",
  })
}