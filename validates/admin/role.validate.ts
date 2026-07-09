import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

export const createRole = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      'string.empty': 'Tên nhóm quyền không được để trống',
    }),
    description: Joi.string().allow(''),
    status: Joi.string().allow(''),
    permissions: Joi.string().allow(''),
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