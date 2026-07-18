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

    const existAccount = await AccountAdmin.findOne(
      {
        _id: decoded.id,
        email: decoded.email,
        deleted: false,
        status: 'active'
      }
    );

    if (!existAccount) {
      return res.redirect(`/${pathAdmin}/auth/account-login`);
    }

    res.locals.accountAdmin = existAccount;

    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.redirect(`/${pathAdmin}/auth/account-login`);
  }
};