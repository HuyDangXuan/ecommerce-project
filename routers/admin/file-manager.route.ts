import { Router } from "express";
import * as fileManagerController from "../../controllers/admin/file-manager.controller";
import multer from "multer";
import { checkPermission } from "../../middlewares/auth.middleware";

const upload = multer();

const router = Router();

router.get('/', checkPermission('file-manager'), fileManagerController.GETfileManager)

router.get('/iframe', checkPermission('file-manager'), fileManagerController.GETfileManagerIframe)

router.post(
  '/upload',
  checkPermission('file-manager'),
  upload.array('files'),
  fileManagerController.POSTuploadFile
)

router.patch(
  '/change-file-name',
  checkPermission('file-manager'),
  upload.array('files'),
  fileManagerController.PATCHchangeFileName
)

router.delete(
  '/delete-file/:id',
  checkPermission('file-manager'),
  fileManagerController.DELETEdeleteFile
)

router.post(
  '/folder/create',
  checkPermission('file-manager'),
  fileManagerController.POSTcreateFolder
)

router.delete(
  '/folder/delete',
  checkPermission('file-manager'),
  fileManagerController.DELETEdeleteFolder
)

export default router;