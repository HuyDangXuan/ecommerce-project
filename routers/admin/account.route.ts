import { Router } from "express";
import * as accountController from "../../controllers/admin/account.controller";
import * as accountValidate from "../../validates/admin/account.validate";
import multer from "multer";

const router = Router();

const upload = multer();

router.get('/account-list', accountController.GETgetAccount)

router.get('/account-create', accountController.GETgetAccountCreate)
router.post('/account-create', 
  upload.none(),
  accountValidate.createAccount, 
  accountController.POSTpostAccountCreate)

export default router;