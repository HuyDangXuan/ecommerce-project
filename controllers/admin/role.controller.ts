import { Request, Response } from 'express'
import { permissionList } from '../../config/variable.config'
import slugify from 'slugify'
import Role from '../../models/roles.model';

export const GETroleList = (req: Request, res: Response) => {
  res.render('admin/pages/roles/role-list', {
    title: 'Danh sách nhóm quyền',
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
