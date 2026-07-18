import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import AccountAdmin from '../models/account-admin.model';
import { pathAdmin } from '../config/variable.config';

export const verifyTokenAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect(`/${pathAdmin}/auth/account-login`);
    }

    const decoded = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`) as jwt.JwtPayload;

    if (decoded.id === process.env.SUPER_ADMIN_ID && decoded.email === process.env.SUPER_ADMIN_EMAIL) {
      res.locals.accountAdmin = {
        _id: decoded.id,
        email: process.env.SUPER_ADMIN_EMAIL,
        fullName: 'Super Admin',
        avatar: '',
      }
    } else {

      const existAccount = await AccountAdmin.findOne(
        {
          _id: decoded.id,
          email: decoded.email,
          deleted: false,
          status: 'active'
        }
      )

      if (!existAccount) {
        res.clearCookie('token');

        res.redirect(`/${pathAdmin}/auth/account-login`);

        return;
      }

      res.locals.accountAdmin = existAccount;
    };

    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.redirect(`/${pathAdmin}/auth/account-login`);
  }
};