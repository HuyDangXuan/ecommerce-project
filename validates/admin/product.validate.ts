import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      'string.empty': 'Tiêu đề sản phẩm không được để trống',
    }),
    description: Joi.string().allow(''),
    category: Joi.string().allow(''),
    content: Joi.string().allow(''),
    images: Joi.string().allow(''),
    slug: Joi.string().required().messages({
      'string.empty': 'Slug không được để trống',
    }),
    status: Joi.string().allow(''),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    const errorMessage = error.details[0].message;

    res.json({
      code: "error",
      message: errorMessage,
    });
    return;
  }
  next();
}

export const createProductCategory = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      'string.empty': 'Tên danh mục sản phẩm không được để trống',
    }),
    description: Joi.string().allow(''),
    parentCategory: Joi.string().allow(''),
    slug: Joi.string().required().messages({
      'string.empty': 'Slug không được để trống',
    }),
    status: Joi.string().allow(''),
    avatar: Joi.string().allow(''),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    const errorMessage = error.details[0].message;

    res.json({
      code: "error",
      message: errorMessage,
    });
    return;
  }
  next();
}

