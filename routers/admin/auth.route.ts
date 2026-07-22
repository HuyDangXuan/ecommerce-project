import { Router } from "express";
import * as authController from "../../controllers/admin/auth.controller";
import multer from "multer";
import { verifyTokenAdmin } from "../../middlewares/auth.middleware";

const router = Router();

const upload = multer();

router.get('/account-login', authController.GETaccountLogin)

router.post('/account-login', upload.none(), authController.POSTaccountLogin)

router.get('/account-logout', verifyTokenAdmin, authController.POSTaccountLogout)

export default router;