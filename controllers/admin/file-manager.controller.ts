import { Request, Response } from "express";

export const GETfileManager = (req: Request, res: Response) => {
  res.render('admin/pages/file-manager', {
    title: 'Quản lý file',
  })
}

export const POSTuploadFile = (req: Request, res: Response) => {
  console.log(req.files);
  res.json({
    code: 'success',
    message: 'Upload file thành công',
    files: req.files,
  })
}