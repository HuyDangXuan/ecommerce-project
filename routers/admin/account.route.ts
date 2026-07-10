import { Router } from "express";
import * as accountController from "../../controllers/admin/account.controller";
import * as accountValidate from "../../validates/admin/account.validate";
import multer from "multer";

const router = Router();

const upload = multer();

router.get('/account-list', accountController.GETaccount)

router.get('/account-create', accountController.GETaccountCreate)
router.post('/account-create', 
  upload.none(),
  accountValidate.createAccount, 
  accountController.POSTaccountCreate)


router.get('/account-edit/:id', accountController.GETaccountEdit)
router.patch('/account-edit/:id', 
  upload.none(),
  accountValidate.editAccount, 
  accountController.PATCHaccountEdit)

router.patch('/account-delete/:id', accountController.DELETEaccount)

export default router;