import { Request, Response } from 'express'
import slugify from 'slugify';
import bcrypt from 'bcryptjs';
import Role from '../../models/roles.model';
import AccountAdmin from '../../models/account-admin.model';

export const GETgetAccountCreate = async (req: Request, res: Response) => {
  const roleList = await Role.find({ 
    deleted: false,
    status: "active", 
  });

  res.render('admin/pages/accounts/account-admin-create', {
    title: 'Quản lý tài khoản',
    roleList: roleList
  });
}

export const POSTpostAccountCreate = async (req: Request, res: Response) => {
  try {
    const existEmail = await AccountAdmin.findOne({ 
      email: req.body.email 
    });

    if (existEmail) {
      res.json({
        code: "error",
        message: "Email đã tồn tại",
      });
      return;
    }

    req.body.roles = JSON.parse(req.body.roles);

    req.body.search = slugify(`${req.body.name} ${req.body.email}`, {
      replacement: ' ',
      lower: true,
    });

    req.body.password = await bcrypt.hash(req.body.password, 10);

    const newRecord = new AccountAdmin(req.body);
    await newRecord.save();

    res.json({
      code: "success",
      message: "Tạo tài khoản thành công",
    });
    
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Đã xảy ra lỗi khi tạo tài khoản",
    });
  }
}
