import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import AccountAdmin from '../models/account-admin.model';
import { pathAdmin, permissionList } from '../config/variable.config';
import Role from '../models/roles.model';
import { RequestAccount } from '../interfaces/request.interface';

export const verifyTokenAdmin = async (req: RequestAccount, res: Response, next: NextFunction) => {
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
      };

      res.locals.permissions = permissionList.map(item => item.id);

      req.adminId = decoded.id;

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

      let permissions: string[] = [];
      for (const roleId of existAccount.roles) {
        const role = await Role.findOne({ 
          _id: roleId, 
          deleted: false, 
          status: 'active' 
        });

        if (role) {
          permissions = [...permissions, ...role.permissions];
        }
      }
      res.locals.permissions = permissions;

      req.adminId = decoded.id;
    };

    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.redirect(`/${pathAdmin}/auth/account-login`);
  }
};

export const checkPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.permissions.includes(permission)) {
      next();
    } else {
      res.json({
        code: 'error',
        message: 'Bạn không có quyền truy cập vào chức năng này'
      });
    }
  };
};