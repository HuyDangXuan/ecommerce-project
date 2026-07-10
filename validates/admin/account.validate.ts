import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

export const createAccount = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string()
    .required()
    .min(5)
    .max(50)
    .messages({
      'string.empty': 'Tiêu đề bài viết không được để trống',
      'string.min': 'Tiêu đề bài viết phải có ít nhất 5 ký tự',
      'string.max': 'Tiêu đề bài viết không được vượt quá 50 ký tự',
    }),
    email: Joi.string()
    .required()
    .email()
    .messages({
      'string.empty': 'Email không được để trống',
      'string.email': 'Email không đúng định dạng',
    }),
    password: Joi.string()
    .required()
    .min(8)
    .custom((value, helpers) => {
      if (!/[A-Z]/.test(value)) {
        return helpers.error('password.uppercase');
      }
      if (!/[a-z]/.test(value)) {
        return helpers.error('password.lowercase');
      }
      if (!/[0-9]/.test(value)) {
        return helpers.error('password.digit');
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        return helpers.error('password.special');
      }
    })
    .messages({
      'string.empty': 'Mật khẩu không được để trống',
      'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
      'password.uppercase': 'Mật khẩu phải chứa ít nhất 1 ký tự in hoa',
      'password.lowercase': 'Mật khẩu phải chứa ít nhất 1 ký tự thường',
      'password.digit': 'Mật khẩu phải chứa ít nhất 1 chữ số',
      'password.special': 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt',
    }),
    status: Joi.string().allow(''),
    avatar: Joi.string().allow(''),
    roles: Joi.string().allow(''),
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

export const editAccount = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string()
    .required()
    .min(5)
    .max(50)
    .messages({
      'string.empty': 'Tiêu đề bài viết không được để trống',
      'string.min': 'Tiêu đề bài viết phải có ít nhất 5 ký tự',
      'string.max': 'Tiêu đề bài viết không được vượt quá 50 ký tự',
    }),
    email: Joi.string()
    .required()
    .email()
    .messages({
      'string.empty': 'Email không được để trống',
      'string.email': 'Email không đúng định dạng',
    }),
    status: Joi.string().allow(''),
    avatar: Joi.string().allow(''),
    roles: Joi.string().allow(''),
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