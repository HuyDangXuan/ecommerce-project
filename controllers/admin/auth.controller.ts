import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import AccountAdmin from '../../models/account-admin.model'
import { pathAdmin } from '../../config/variable.config'

export const GETaccountLogin = (req: Request, res: Response) => {
  res.render('admin/pages/auth/account-login', {
    title: 'Đăng nhập',
  });
}

export const POSTaccountLogin = async (req: Request, res: Response) => {
  try {
    const { email, password, rememberMe } = req.body;

    const existAccount = await AccountAdmin.findOne({ 
      email: email, 
      deleted: false
    });

    let token = "";

    if (!existAccount) {
      if (email !== process.env.SUPER_ADMIN_EMAIL) {
        res.json({
          code: "error",
          message: "Tài khoản không tồn tại!",
        });
        return;
      }

      const isMatch = password === process.env.SUPER_ADMIN_PASSWORD;

      if (!isMatch) {
        res.json({
          code: "error",
          message: "Mật khẩu không đúng!",
        });
        return;
      }

        token = jwt.sign(
        {
          id: process.env.SUPER_ADMIN_ID,
          email: process.env.SUPER_ADMIN_EMAIL,
        },
          `${process.env.JWT_SECRET_KEY}`,
        {
          expiresIn: rememberMe ? '7d' : '1h',
        }
      );
      return;
    } else {

      const isMatch = await bcrypt.compare(password, `${existAccount.password}`);

      if (!isMatch) {
        res.json({
          code: "error",
          message: "Email hoặc mật khẩu không đúng.",
        });
        return;
      }

      if (existAccount.status === 'initial') {
        res.json({
          code: "error",
          message: "Tài khoản chưa được kích hoạt.",
        });
        return;
      }

      if (existAccount.status === 'inactive') {
        res.json({
          code: "error",
          message: "Tài khoản đã bị vô hiệu hóa.",
        });
        return;
      }

      token = jwt.sign(
        {
          id: existAccount._id,
          email: existAccount.email,
        },
          `${process.env.JWT_SECRET_KEY}`,
        {
          expiresIn: rememberMe ? '7d' : '1h',
        }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: 'strict',
        maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000, // 7 days or 1 hour
      });
    }

    res.json({
      code: "success",
      message: "Đăng nhập thành công."
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.json({
      code: "error",
      message: "Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại sau.",
    });
  }
}

export const POSTaccountLogout = (req: Request, res: Response) => {
  res.clearCookie('token');

  res.redirect(`/${pathAdmin}/auth/account-login`);
}

