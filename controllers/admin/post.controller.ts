import { Request, Response } from 'express'
import Post from '../../models/posts.model'
import PostCategory from '../../models/post-categories.model'
import buildCategoryTree from '../../helpers/category.helper'
import { pathAdmin } from '../../config/variable.config'
import slugify from 'slugify';
import { logAdminAction } from '../../helpers/log.helper';
import { Parser } from 'json2csv'

// POST

export const GETpostList = async (req: Request, res: Response) => {
  const find: {
    deleted: boolean,
    search?: RegExp
  } = {
    deleted: false,
  }

  // Search

  if (req.query.keyword) {
    const keyword = slugify(req.query.keyword as string, {
      replacement: '-',
      lower: true,
    });
    const keywordRegex = new RegExp(keyword, 'i');
    find.search = keywordRegex;
  }

  // End Search

  // Pagination
  const limitItem = 10;
  let page = 1;
  if (req.query.page && parseInt(`${req.query.page}`) > 0) {
    page = parseInt(`${req.query.page}`);
  }

  const totalRecord = await Post.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItem);
  const skip = (page - 1) * limitItem;

  const pagination = {
    totalPage: totalPage,
    totalRecord: totalRecord,
    skip: skip,
  }

  res.locals.pagination = pagination;
  // End Pagination

  const posts: any = await Post
    .find(find)
    .skip(skip)
    .limit(limitItem)
    .sort({
       createdAt: "desc" 
    });

  for (const item of posts) {
    const categoryList = await PostCategory.find({
      _id: { $in: item.category }
    })
    const categoryListName = categoryList.map((item: any) => item.name);
    item.categoryListName = categoryListName;
  }

  res.render('admin/pages/posts/post-list', {
    title: 'Danh sách bài viết',
    posts: posts
  })
}

export const GETcreatePost = async (req: Request, res: Response) => {
  const categories = await PostCategory.find();
  const categoryTree = buildCategoryTree(categories, "");

  res.render('admin/pages/posts/post-create', {
    title: 'Tạo bài viết',
    categories: categoryTree
  })
}

export const POSTcreatePost = async (req: Request, res: Response) => {
  try {
    const existingPost = await Post.findOne({ slug: req.body.slug });
    if (existingPost) {
      res.json({
        code: "error",
        message: "Slug đã tồn tại, vui lòng chọn slug khác",
      });
      return;
    }

    req.body.category = JSON.parse(req.body.category);

    req.body.search = slugify(`${req.body.name} ${req.body.slug}`, 
      {
        replacement: '-',
        lower: true,
      }
    );

    if (req.body.status === 'published') {
      req.body.publishedAt = new Date();
    }

    const newRecord = new Post(req.body);
    await newRecord.save();

    logAdminAction(req, `Tạo bài viết: ${newRecord.name} (ID: ${newRecord.id})`);

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

export const GETeditPost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);

  if (!post) {
    res.redirect(`${pathAdmin}/posts/post-list`);
    return;
  }

  const categories = await PostCategory.find();
  const categoryTree = buildCategoryTree(categories, "");

  res.render('admin/pages/posts/post-edit', {
    title: 'Chỉnh sửa bài viết',
    categories: categoryTree,
    post: post
  })
}

export const PATCHeditPost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      res.json({
        code: "error",
        message: "Bài viết không tồn tại",
      });
      return;
    }

    const existingPost = await Post.findOne({
      _id: { $ne: postId },
      slug: req.body.slug 
    });
    if (existingPost) {
      res.json({
        code: "error",
        message: "Slug đã tồn tại, vui lòng chọn slug khác",
      });
      return;
    }

    req.body.category = JSON.parse(req.body.category);

    req.body.search = slugify(`${req.body.name} ${req.body.slug}`, 
      {
        replacement: '-',
        lower: true,
      }
    );

    await Post.findByIdAndUpdate(postId, req.body);

    logAdminAction(req, `Cập nhật bài viết: ${post.name} (ID: ${post.id})`);

    res.json({
      code: "success",
      message: "Bài viết đã được cập nhật thành công",
    })

  } catch (error) {
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ",
    })
  }
}

export const PATCHdeletePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      res.json({
        code: "error",
        message: "Bài viết không tồn tại",
      });
      return;
    }

    await Post.findByIdAndUpdate(postId, {
       deleted: true,
       deletedAt: new Date(),
      });

    logAdminAction(req, `Xóa bài viết: ${post.name} (ID: ${post.id})`);

    res.json({
      code: "success",
      message: "Đã xóa bài viết thành công",
    })

  } catch (error) {
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ",
    })
  }
}

export const GETexportPostCSV = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({ deleted: false }).lean();

    const parser = new Parser();
    const csv = parser.parse(posts);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    
    res.setHeader('Content-Disposition', 'attachment; filename=posts.csv');

    res.write('\uFEFF');

    res.end(csv);

  } catch (error) {
    console.error(error);
  }
}

// END POST

// CATEGORY

export const GETcategoryList = async (req: Request, res: Response) => {
  const find: {
    deleted: boolean,
    search?: RegExp
  } = {
    deleted: false,
  }

  // Search

  if (req.query.keyword) {
    const keyword = slugify(req.query.keyword as string, {
      replacement: '-',
      lower: true,
    });
    const keywordRegex = new RegExp(keyword, 'i');
    find.search = keywordRegex;
  }

  // End Search

  // Pagination
  const limitItem = 10;
  let page = 1;
  if (req.query.page && parseInt(`${req.query.page}`) > 0) {
    page = parseInt(`${req.query.page}`);
  }

  const totalRecord = await PostCategory.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItem);
  const skip = (page - 1) * limitItem;
  const pagination = {
    totalPage: totalPage,
    totalRecord: totalRecord,
    skip: skip,
  }
  res.locals.pagination = pagination;
  // End Pagination

  const categories: any = await PostCategory
    .find(find)
    .skip(skip)
    .limit(limitItem)
    .sort({
       createdAt: "desc" 
    });

  for (const item of categories) {
    if (item.parentCategory) {
      const parent = await PostCategory.findById(item.parentCategory);
      item.parentName = parent ? parent.name : "Không có";
    }
  }

  res.render('admin/pages/posts/category-list', {
    title: 'Danh sách danh mục',
    categories: categories
  })
}

export const GETcreateCategory = async (req: Request, res: Response) => {
  const categories = await PostCategory.find();
  const categoryTree = buildCategoryTree(categories, "");

  res.render('admin/pages/posts/category-create', {
    title: 'Tạo danh mục bài viết',
    categories: categoryTree
  })
}

export const POSTcreateCategory = async (req: Request, res: Response) => {
  try {
    const existingCategory = await PostCategory.findOne({ slug: req.body.slug });
    if (existingCategory) {
      res.json({
        code: "error",
        message: "Slug đã tồn tại, vui lòng chọn slug khác",
      });
      return;
    }

    req.body.search = slugify(`${req.body.name} ${req.body.slug}`, 
      {
        replacement: '-',
        lower: true,
      }
    );

    const newRecord = new PostCategory(req.body);
    await newRecord.save();

    logAdminAction(req, `Tạo danh mục: ${newRecord.name} (ID: ${newRecord.id})`);

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

export const GETeditCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.id;
  const category = await PostCategory.findById(categoryId);

  if (!category) {
    res.redirect(`${pathAdmin}/posts/category-list`);
    return;
  }

  const categories = await PostCategory.find();
  const categoryTree = buildCategoryTree(categories, "");

  res.render('admin/pages/posts/category-edit', {
    title: 'Chỉnh sửa danh mục bài viết',
    categories: categoryTree,
    category: category
  })
}

export const PATCHeditCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    const category = await PostCategory.findById(categoryId);

    if (!category) {
      res.json({
        code: "error",
        message: "Danh mục không tồn tại",
      });
      return;
    }

    const existingCategory = await PostCategory.findOne({ 
      _id: { $ne: categoryId },
      slug: req.body.slug,
    });
    if (existingCategory) {
      res.json({
        code: "error",
        message: "Slug đã tồn tại, vui lòng chọn slug khác",
      });
      return;
    }

    req.body.search = slugify(`${req.body.name} ${req.body.slug}`, 
      {
        replacement: '-',
        lower: true,
      }
    );

    await PostCategory.findByIdAndUpdate(categoryId, req.body);

    res.json({
      code: "success",
      message: "Danh mục đã được cập nhật thành công",
    })

  } catch (error) {
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ",
    })
  }
}

export const PATCHdeleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    const category = await PostCategory.findById(categoryId);

    if (!category) {
      res.json({
        code: "error",
        message: "Danh mục không tồn tại",
      });
      return;
    }

    await PostCategory.findByIdAndUpdate(categoryId, {
      deleted: true,
      deletedAt: new Date()
    });

    logAdminAction(req, `Xóa danh mục: ${category.name} (ID: ${category.id})`);

    res.json({
      code: "success",
      message: "Đã xóa danh mục thành công",
    })

  } catch (error) {
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ",
    })
  }
}

export const GETexportCategoryCSV = async (req: Request, res: Response) => {
  try {
    const categories = await PostCategory.find({ deleted: false }).lean();

    const parser = new Parser();
    const csv = parser.parse(categories);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    
    res.setHeader('Content-Disposition', 'attachment; filename=categories.csv');

    res.write('\uFEFF');

    res.end(csv);

  } catch (error) {
    console.error(error);
  }
}

// END CATEGORY