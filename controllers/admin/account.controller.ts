import { Request, Response } from 'express'
import slugify from 'slugify';
import bcrypt from 'bcryptjs';
import Role from '../../models/roles.model';
import AccountAdmin from '../../models/account-admin.model';
import { pathAdmin } from '../../config/variable.config';

export const GETaccount = async (req: Request, res: Response) => {
  const find: {
    deleted: boolean,
    search?: RegExp
  } = {
    deleted: false,
  }

  // Search

  if (req.query.keyword) {
    const keyword = slugify(req.query.keyword as string, {
      replacement: '-',
      lower: true,
    });
    const keywordRegex = new RegExp(keyword, 'i');
    find.search = keywordRegex;
  }

  // End Search

  // Pagination
  const limitItem = 10;
  let page = 1;
  if (req.query.page && parseInt(`${req.query.page}`) > 0) {
    page = parseInt(`${req.query.page}`);
  }

  const totalRecord = await Role.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItem);
  const skip = (page - 1) * limitItem;

  const pagination = {
    totalPage: totalPage,
    totalRecord: totalRecord,
    skip: skip,
  }

  res.locals.pagination = pagination;
  // End Pagination

  const accountList: any = await AccountAdmin
    .find(find)
    .skip(skip)
    .limit(limitItem)
    .sort({
       createdAt: "desc" 
    });

  for (const account of accountList) {
    const roleList = await Role.find({
      _id: { $in: account.roles }
    });
    account.rolesName = roleList.map(item => item.name);
  }
  res.render('admin/pages/accounts/account-admin-list', {
    title: 'Quản lý tài khoản',
    accountList: accountList,
    pagination: pagination
  });
}

export const GETaccountCreate = async (req: Request, res: Response) => {
  const roleList = await Role.find({ 
    deleted: false,
    status: "active", 
  });

  res.render('admin/pages/accounts/account-admin-create', {
    title: 'Quản lý tài khoản',
    roleList: roleList
  });
}

export const POSTaccountCreate = async (req: Request, res: Response) => {
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

export const GETaccountEdit = async (req: Request, res: Response) => {
  try {
    const accountId = req.params.id;

    const account: any = await AccountAdmin.findOne({
      _id: accountId,
      deleted: false,
    });

    if (!account) {
      res.redirect(`/${pathAdmin}/accounts/account-list`);
      return;
    }

    const roleList = await Role.find({
      deleted: false,
      status: "active",
    });

    res.render('admin/pages/accounts/account-admin-edit', {
      title: 'Chỉnh sửa tài khoản',
      account: account,
      roleList: roleList
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Đã xảy ra lỗi khi lấy thông tin tài khoản",
    });
  }
}

export const PATCHaccountEdit = async (req: Request, res: Response) => {
  try {
    const accountId = req.params.id;

    const account: any = await AccountAdmin.findOne({
      _id: accountId,
      deleted: false,
    });

    if (!account) {
      res.json({
        code: "error",
        message: "Tài khoản không tồn tại",
      });
      return;
    }

    req.body.roles = JSON.parse(req.body.roles);

    req.body.search = slugify(`${req.body.name} ${req.body.email}`, {
      replacement: ' ',
      lower: true,
    });

    await AccountAdmin.updateOne({ _id: accountId }, req.body);

    res.json({
      code: "success",
      message: "Cập nhật tài khoản thành công",
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Đã xảy ra lỗi khi cập nhật tài khoản",
    });
  }
}

export const DELETEaccount = async (req: Request, res: Response) => {
  try {
    const accountId = req.params.id;

    const account: any = await AccountAdmin.findOne({
      _id: accountId,
      deleted: false,
    });

    if (!account) {
      res.json({
        code: "error",
        message: "Tài khoản không tồn tại",
      });
      return;
    }

    await AccountAdmin.findByIdAndUpdate(accountId, { 
      deleted: true,
      deletedAt: Date.now(),
    });

    res.json({
      code: "success",
      message: "Xóa tài khoản thành công",
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Đã xảy ra lỗi khi xóa tài khoản",
    });
  }
}