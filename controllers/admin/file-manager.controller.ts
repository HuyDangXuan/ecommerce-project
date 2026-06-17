import { Request, Response } from "express";
import FormData from "form-data";
import axios from "axios";
import Media from "../../models/media.model";

export const GETfileManager = async (req: Request, res: Response) => {
  const media = await Media
  .find()
  .sort({ 
    createdAt: "desc" 
  });

  res.render('admin/pages/file-manager', {
    title: 'Quản lý file',
    media: media,
  })
}

export const POSTuploadFile = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      })
    })

    const response = await axios.post('http://localhost:4000/file-manager/upload', formData, {
      headers: {
        ...formData.getHeaders(),
      }
    })

    await Media.insertMany(response.data.savedLinks);

    res.json({
      code: 'success',
      message: response.data.message,
      files: req.files,
    })
  } catch (error) {
    console.error(error);
    res.json({
      code: 'error',
      message: 'Upload file thất bại',
    })
  }
}