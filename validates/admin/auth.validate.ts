import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

export const login = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.empty': 'Email không được để trống',
        'string.email': 'Email không hợp lệ',
    }),
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        'string.empty': 'Mật khẩu không được để trống',
        'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
    }),
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