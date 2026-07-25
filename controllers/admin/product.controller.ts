import { Request, Response } from 'express'
import Products from '../../models/products.model'
import ProductCategory from '../../models/product-categories.model'
import buildCategoryTree from '../../helpers/category.helper'
import { pathAdmin } from '../../config/variable.config'
import slugify from 'slugify';
import { logAdminAction } from '../../helpers/log.helper';
import AttributeProduct from '../../models/attribute-product.model'

// PRODUCTS

export const GETproductList = async (req: Request, res: Response) => {
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

  const totalRecord = await Products.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItem);
  const skip = (page - 1) * limitItem;

  const pagination = {
    totalPage: totalPage,
    totalRecord: totalRecord,
    skip: skip,
  }

  res.locals.pagination = pagination;
  // End Pagination

  const products: any = await Products
    .find(find)
    .skip(skip)
    .limit(limitItem)
    .sort({
       createdAt: "desc" 
    });

  for (const item of products) {
    const categoryList = await ProductCategory.find({
      _id: { $in: item.category }
    })
    const categoryListName = categoryList.map((item: any) => item.name);
    item.categoryListName = categoryListName;
  }

  res.render('admin/pages/products/products-list', {
    title: 'Danh sách sản phẩm',
    products: products
  })
}

export const GETcreateProduct = async (req: Request, res: Response) => {
  const categories = await ProductCategory.find();
  const categoryTree = buildCategoryTree(categories, "");

  res.render('admin/pages/products/products-create', {
    title: 'Tạo sản phẩm',
    categories: categoryTree
  })
}

export const POSTcreateProduct = async (req: Request, res: Response) => {
  try {

    const existingProduct = await Products.findOne({ slug: req.body.slug });
    if (existingProduct) {
      res.json({
        code: "error",
        message: "Slug đã tồn tại, vui lòng chọn slug khác",
      });
      return;
    }

    req.body.category = JSON.parse(req.body.category);

    req.body.images = JSON.parse(req.body.images);

    if (req.body.priceOld) {
      req.body.priceOld = parseInt(`${req.body.priceOld}`);
    }

    if (req.body.priceNew) {
      req.body.priceNew = parseInt(`${req.body.priceNew}`);
    } else {
      req.body.priceNew = parseInt(`${req.body.priceOld}`);
    }

    req.body.search = slugify(`${req.body.name} ${req.body.slug}`, 
      {
        replacement: '-',
        lower: true,
      }
    );

    if (req.body.status === 'published') {
      req.body.publishedAt = new Date();
    }

    const newRecord = new Products(req.body);
    await newRecord.save();

    logAdminAction(req, `Tạo sản phẩm: ${newRecord.name} (ID: ${newRecord.id})`);

    res.json({
      code: "success",
      message: "Sản phẩm đã được tạo thành công",
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ",
    })
  }
}

export const GETeditProduct = async (req: Request, res: Response) => {
  const productId = req.params.id;
  const product = await Products.findById(productId);

  if (!product) {
    res.redirect(`${pathAdmin}/products/product-list`);
    return;
  }

  const categories = await ProductCategory.find();
  const categoryTree = buildCategoryTree(categories, "");

  res.render('admin/pages/products/products-edit', {
    title: 'Chỉnh sửa sản phẩm',
    categories: categoryTree,
    product: product
  })
}

export const PATCHeditProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await Products.findById(productId);

    if (!product) {
      res.json({
        code: "error",
        message: "Sản phẩm không tồn tại",
      });
      return;
    }

    const existingProduct = await Products.findOne({
      _id: { $ne: productId },
      slug: req.body.slug 
    });
    if (existingProduct) {
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

    await Products.findByIdAndUpdate(productId, req.body);

    logAdminAction(req, `Cập nhật sản phẩm: ${product.name} (ID: ${product.id})`);

    res.json({
      code: "success",
      message: "Sản phẩm đã được cập nhật thành công",
    })

  } catch (error) {
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ",
    })
  }
}

export const PATCHdeleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await Products.findById(productId);

    if (!product) {
      res.json({
        code: "error",
        message: "Sản phẩm không tồn tại",
      });
      return;
    }

    await Products.findByIdAndUpdate(productId, {
       deleted: true,
       deletedAt: new Date(),
      });

    logAdminAction(req, `Xóa sản phẩm: ${product.name} (ID: ${product.id})`);

    res.json({
      code: "success",
      message: "Đã xóa sản phẩm thành công",
    })

  } catch (error) {
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ",
    })
  }
}

// PRODUCT CATEGORIES

export const GETproductCategoryList = async (req: Request, res: Response) => {
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

  const totalRecord = await ProductCategory.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItem);
  const skip = (page - 1) * limitItem;
  const pagination = {
    totalPage: totalPage,
    totalRecord: totalRecord,
    skip: skip,
  }
  res.locals.pagination = pagination;
  // End Pagination

  const categories: any = await ProductCategory
    .find(find)
    .skip(skip)
    .limit(limitItem)
    .sort({
       createdAt: "desc" 
    });

  for (const item of categories) {
    if (item.parentCategory) {
      const parent = await ProductCategory.findById(item.parentCategory);
      item.parentName = parent ? parent.name : "Không có";
    }
  }

  res.render('admin/pages/products/products-category-list', {
    title: 'Danh sách danh mục',
    categories: categories
  })
}

export const GETcreateProductCategory = async (req: Request, res: Response) => {
  const categories = await ProductCategory.find();
  const categoryTree = buildCategoryTree(categories, "");

  res.render('admin/pages/products/products-category-create', {
    title: 'Tạo danh mục sản phẩm',
    categories: categoryTree
  })
}

export const POSTcreateProductCategory = async (req: Request, res: Response) => {
  try {
    const existingCategory = await ProductCategory.findOne({ slug: req.body.slug });
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

    const newRecord = new ProductCategory(req.body);
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

export const GETeditProductCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.id;
  const category = await ProductCategory.findById(categoryId);

  if (!category) {
    res.redirect(`${pathAdmin}/products/products-category-list`);
    return;
  }

  const categories = await ProductCategory.find();
  const categoryTree = buildCategoryTree(categories, "");

  res.render('admin/pages/products/products-category-edit', {
    title: 'Chỉnh sửa danh mục sản phẩm',
    categories: categoryTree,
    category: category
  })
}

export const PATCHeditProductCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    const category = await ProductCategory.findById(categoryId);

    if (!category) {
      res.json({
        code: "error",
        message: "Danh mục không tồn tại",
      });
      return;
    }

    const existingCategory = await ProductCategory.findOne({ 
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

    await ProductCategory.findByIdAndUpdate(categoryId, req.body);

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

export const PATCHdeleteProductCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    const category = await ProductCategory.findById(categoryId);

    if (!category) {
      res.json({
        code: "error",
        message: "Danh mục không tồn tại",
      });
      return;
    }

    await ProductCategory.findByIdAndUpdate(categoryId, {
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

// PRODUCT ATTRIBUTES

export const GETproductAttributeList = async (req: Request, res: Response) => {
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

  const totalRecord = await AttributeProduct.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItem);
  const skip = (page - 1) * limitItem;
  const pagination = {
    totalPage: totalPage,
    totalRecord: totalRecord,
    skip: skip,
  }
  res.locals.pagination = pagination;
  // End Pagination

  const recordList = await AttributeProduct
    .find(find)
    .skip(skip)
    .limit(limitItem)
    .sort({
       createdAt: "desc" 
    });

  res.render('admin/pages/products/products-attribute', {
    title: 'Danh sách thuộc tính sản phẩm',
    recordList: recordList
  })
}

export const GETcreateProductAttribute = async (req: Request, res: Response) => {
  res.render('admin/pages/products/products-create-attribute', {
    title: 'Tạo thuộc tính sản phẩm',
  })
}

export const POSTcreateProductAttribute = async (req: Request, res: Response) => {
  try {
    req.body.options = JSON.parse(req.body.options);

    req.body.search = slugify(`${req.body.name}`, 
      {
        replacement: '-',
        lower: true,
      }
    );

    const newRecord = new AttributeProduct(req.body);
    await newRecord.save();

    await logAdminAction(req, `Tạo thuộc tính sản phẩm: ${newRecord.name} (ID: ${newRecord.id})`);

    res.json({
      code: "success",
      message: "Thuộc tính sản phẩm đã được tạo thành công",
    })

  } catch (error) {
    console.error(error);
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ",
    })
  }
}

export const GETeditProductAttribute = async (req: Request, res: Response) => {
  const attributeId = req.params.id;
  const attribute = await AttributeProduct.findById(attributeId);

  if (!attribute) {
    res.redirect(`${pathAdmin}/products/product-attribute-list`);
    return;
  }

  res.render('admin/pages/products/products-edit-attribute', {
    title: 'Chỉnh sửa thuộc tính sản phẩm',
    attribute: attribute
  })
}

export const PATCHeditProductAttribute = async (req: Request, res: Response) => {
  try {
    const attributeId = req.params.id;
    const attribute = await AttributeProduct.findById(attributeId);

    if (!attribute) {
      res.json({
        code: "error",
        message: "Thuộc tính sản phẩm không tồn tại",
      });
      return;
    }

    req.body.options = JSON.parse(req.body.options);

    req.body.search = slugify(`${req.body.name}`,
      {
        replacement: '-',
        lower: true,
      }
    );

    await AttributeProduct.updateOne({
      _id: attributeId,
      deleted: false
    }, req.body);

    await logAdminAction(req, `Chỉnh sửa thuộc tính sản phẩm: ${attribute.name} (ID: ${attribute.id})`);

    res.json({
      code: "success",
      message: "Thuộc tính sản phẩm đã được cập nhật thành công",
    })
  } catch (error) {
    console.error(error);
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ",
    })
  }
}

export const PATCHdeleteProductAttribute = async (req: Request, res: Response) => {
  try {
    const attributeId = req.params.id;
    const attribute = await AttributeProduct.findById(attributeId);

    if (!attribute) {
      res.json({
        code: "error",
        message: "Thuộc tính sản phẩm không tồn tại",
      });
      return;
    }

    await AttributeProduct.updateOne({
      _id: attributeId,
      deleted: false
    }, {
      deleted: true,
      deletedAt: new Date()
    });
    
    await logAdminAction(req, `Xóa thuộc tính sản phẩm: ${attribute.name} (ID: ${attribute.id})`);

    res.json({
      code: "success",
      message: "Thuộc tính sản phẩm đã được xóa thành công",
    });
  } catch (error) {
    console.error(error);
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ",
    });
  }
}