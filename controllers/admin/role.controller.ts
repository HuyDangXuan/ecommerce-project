import { Request, Response } from 'express'
import { pathAdmin, permissionList } from '../../config/variable.config'
import slugify from 'slugify'
import Role from '../../models/roles.model';

export const GETroleList = async (req: Request, res: Response) => {
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

  const roles: any = await Role
    .find(find)
    .skip(skip)
    .limit(limitItem)
    .sort({
       createdAt: "desc" 
    });

  res.render('admin/pages/roles/role-list', {
    title: 'Danh sách nhóm quyền',
    roles: roles
  });
}

export const GETroleCreate = (req: Request, res: Response) => {
  res.render('admin/pages/roles/role-create', {
    title: 'Tạo nhóm quyền',
    permissionList: permissionList
  });
}

export const POSTroleCreate = async (req: Request, res: Response) => {
  try {
    req.body.permissions = JSON.parse(req.body.permissions);

    req.body.search = slugify(`${req.body.name}`, {
      replacement: '-',
      lower: true,
    });

    const newRecord = new Role(req.body);

    await newRecord.save();

    res.json({
      code: "success",
      message: 'Tạo nhóm quyền thành công',
    })
  } catch (error) {
    res.json({
      code: "error",
      message: 'Tạo nhóm quyền thất bại',
    })
  }
}

export const GETroleEdit = async (req: Request, res: Response) => {
  try {
    const roleId = req.params.id;

    const role: any = await Role.findOne({
      _id: roleId,
      deleted: false,
    });

    if (!role) {
      res.redirect(`/${pathAdmin}/roles/role-list`);
      return;
    }

    res.render('admin/pages/roles/role-edit', {
      title: 'Chỉnh sửa nhóm quyền',
      role: role,
      permissionList: permissionList
    });
  } catch (error) {
    res.json({
      code: "error",
      message: 'Lấy thông tin nhóm quyền thất bại',
    })
  }
}

export const PATCHroleEdit = async (req: Request, res: Response) => {
  try {
    const roleId = req.params.id;

    const role: any = await Role.findOne({
      _id: roleId,
      deleted: false,
    });

    if (!role) {
      res.json({
        code: "error",
        message: 'Nhóm quyền không tồn tại',
      })
      return;
    }

    req.body.permissions = JSON.parse(req.body.permissions);

    req.body.search = slugify(`${req.body.name}`, {
      replacement: '-',
      lower: true,
    });

    await Role.updateOne(
      {
        _id: roleId,
        deleted: false,
      },
      req.body
    );

    res.json({
      code: "success",
      message: 'Cập nhật nhóm quyền thành công',
    })
  } catch (error) {
    res.json({
      code: "error",
      message: 'Cập nhật nhóm quyền thất bại',
    })
  }
}

export const PATCHroleDelete = async (req: Request, res: Response) => {
  try {
    const roleId = req.params.id;

    const role: any = await Role.findOne({
      _id: roleId,
      deleted: false,
    });

    if (!role) {
      res.json({
        code: "error",
        message: 'Nhóm quyền không tồn tại',
      })
      return;
    }

    await Role.updateOne(
      {
        _id: roleId,
        deleted: false,
      },
      {
        deleted: true,
      }
    );

    res.json({
      code: "success",
      message: 'Xóa nhóm quyền thành công',
    })
  } catch (error) {
    res.json({
      code: "error",
      message: 'Xóa nhóm quyền thất bại',
    })
  }
}