import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

export const createPost = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      'string.empty': 'Tiêu đề bài viết không được để trống',
    }),
    description: Joi.string().allow(''),
    parentCategory: Joi.string().allow(''),
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