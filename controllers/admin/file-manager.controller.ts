import { Request, Response } from "express";
import FormData from "form-data";
import axios from "axios";
import Media from "../../models/media.model";
import moment from "moment";
import { formatFileSize } from "../../helpers/format.helper";
import slugify from 'slugify';
import { domainCDN } from "../../config/variable.config";

export const GETfileManager = async (req: Request, res: Response) => {
  // Danh sách file
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
  
  // Hết danh sách file
  // Danh sách folder
  let listFolder = [];
  const response = await axios.get(`${domainCDN}/file-manager/folder/list`);
  if (response.data.code == 'success') {
    listFolder = response.data.folders;
    for (const item of listFolder) {
      item.createdAtFormatted = moment(item.createdAt).format('DD/MM/YYYY HH:mm:ss');
    }
  }
  // Hết Danh sách folder

  res.render('admin/pages/file-manager', {
    title: 'Quản lý file',
    media: media,
    listFolder: listFolder,
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

    const response = await axios.post(`${domainCDN}/file-manager/upload`, formData, {
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

export const PATCHchangeFileName = async (req: Request, res: Response) => {
  try {
    const { fileId, newFileName } = req.body;

    if (!fileId || !newFileName) {
      return res.json({
        code: "error",
        message: "Thiếu thông tin cần thiết",
      });
    }

    const record = await Media.findOne({
      _id: fileId 
    });

    if (!record) {
      res.json({
        code: 'error',
        message: 'File không tồn tại',
      });
      return
    }

    const formData = new FormData();
    formData.append('newFileName', newFileName);
    formData.append('oldFileName', record.filename);
    formData.append('folder', record.folder);

    const response = await axios.patch(`${domainCDN}/file-manager/change-file-name`, formData, {
      headers: {
        ...formData.getHeaders(),
      }
    })

    if (response.data.code == 'error') {
      res.json({
        code: 'error',
        message: response.data.message,
      })
      return
    }

    await Media.updateOne({
      _id: fileId
    }, {
      filename: newFileName
    });
    
    res.json({
      code: 'success',
      message: 'Thay đổi tên file thành công',
      fileName: newFileName,
    })

  } catch (error) {
    console.error(error);
    res.json({
      code: 'error',
      message: 'Thay đổi tên file thất bại',
    })
  }
}

export const DELETEdeleteFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const record = await Media.findOne({
      _id: id 
    });

    if (!record) {
      res.json({
        code: 'error',
        message: 'File không tồn tại',
      });
      return;
    }

    const formData = new FormData();
    formData.append('fileName', record.filename);
    formData.append('folder', record.folder);

    const response = await axios.patch(`${domainCDN}/file-manager/delete-file`, formData, {
      headers: {
        ...formData.getHeaders(),
      }
    })

    if (response.data.code == 'error') {
      res.json({
        code: 'error',
        message: response.data.message,
      })
      return
    }

    await Media.deleteOne({
      _id: id
    });

    res.json({
      code: 'success',
      message: 'Xóa file thành công',
    });
  } catch (error) {
    console.error(error);
    res.json({
      code: 'error',
      message: 'Xóa file thất bại',
    })
  }
}

export const POSTcreateFolder = async (req: Request, res: Response) => {
  try {
    const { folderName } = req.body;

    if (!folderName) {
      return res.json({
        code: "error",
        message: "Thiếu thông tin cần thiết",
      });
    }

    const formData = new FormData();
    formData.append('folderName', folderName);

    const response = await axios.post(`${domainCDN}/file-manager/folder/create`, formData, {
      headers: {
        ...formData.getHeaders(),
      }
    })

    res.json({
      code: 'success',
      message: 'Tạo thư mục thành công',
    })
  } catch (error) {
    console.error(error);
    res.json({
      code: 'error',
      message: 'Tạo thư mục thất bại',
    })
  }
}