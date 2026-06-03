import { Request, Response } from 'express'

export const posts = (req: Request, res: Response) => {
  res.render('admin/pages/posts/list', {
    title: 'Danh sách bài viết',
  })
}

export const create = (req: Request, res: Response) => {
  res.render('admin/pages/posts/create', {
    title: 'Tạo bài viết',
  })
}

export const createPost = (req: Request, res: Response) => {
  console.log(req.body);

  res.json({
    code: "success",
    message: "Bài viết đã được tạo thành công",
  })
}

export const categories = (req: Request, res: Response) => {
  res.render('admin/pages/posts/categories', {
    title: 'Danh mục bài viết',
  })
}
