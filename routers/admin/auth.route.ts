import { Router } from "express";
import * as authController from "../../controllers/admin/auth.controller";
import multer from "multer";

const router = Router();

const upload = multer();

router.get('/account-login', authController.GETaccountLogin)

router.post('/account-login', upload.none(), authController.POSTaccountLogin)

router.get('/account-logout', authController.POSTaccountLogout)

export default router;