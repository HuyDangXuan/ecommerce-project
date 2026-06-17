import { Request, Response } from "express";
import FormData from "form-data";
import axios from "axios";
import Media from "../../models/media.model";
import moment from "moment";
import { formatFileSize } from "../../helpers/format.helper";
import slugify from 'slugify';

export const GETfileManager = async (req: Request, res: Response) => {
  const find: {
    deleted: boolean,
    filename?: RegExp
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
      find.filename = keywordRegex;
    }
  
    // End Search

  // Pagination
  const limitItem = 10;
  let page = 1;
  if (req.query.page && parseInt(`${req.query.page}`) > 0) {
    page = parseInt(`${req.query.page}`);
  }

  const totalRecord = await Media.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItem);
  const skip = (page - 1) * limitItem;

  const pagination = {
    totalPage: totalPage,
    totalRecord: totalRecord,
    skip: skip,
  }

  res.locals.pagination = pagination;
  // End Pagination

  const media: any = await Media
  .find(find)
  .skip(skip)
  .limit(limitItem)
  .sort({ 
    createdAt: "desc" 
  });

  for (const item of media) {
    item.createdAtFormatted = moment(item.createdAt).format('DD/MM/YYYY HH:mm:ss');
    item.sizeFormatted = formatFileSize(item.size);
  }

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