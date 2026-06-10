import { Router } from "express";
import * as fileManagerController from "../../controllers/admin/file-manager.controller";
import multer from "multer";

const upload = multer();

const router = Router();

router.get('/', fileManagerController.GETfileManager)

router.post('/upload', upload.array('files'), fileManagerController.POSTuploadFile)

export default router;