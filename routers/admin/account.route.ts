import { Router } from "express";
import * as accountController from "../../controllers/admin/account.controller";
import * as accountValidate from "../../validates/admin/account.validate";
import multer from "multer";
import { checkPermission } from "../../middlewares/auth.middleware";

const router = Router();

const upload = multer();

router.get('/account-list', checkPermission('account-admin-list'), accountController.GETaccount)

router.get('/account-create', checkPermission('account-admin-create'), accountController.GETaccountCreate)
router.post('/account-create', 
  checkPermission('account-admin-create'),
  upload.none(),
  accountValidate.createAccount, 
  accountController.POSTaccountCreate)


router.get('/account-edit/:id', checkPermission('account-admin-edit'), accountController.GETaccountEdit)
router.patch('/account-edit/:id', 
  checkPermission('account-admin-edit'),
  upload.none(),
  accountValidate.editAccount, 
  accountController.PATCHaccountEdit)

router.patch('/account-delete/:id', checkPermission('account-admin-delete'), accountController.DELETEaccount)

router.get('/account-change-password/:id', checkPermission('account-admin-change-password'), accountController.GETaccountChangePassword)
router.patch('/account-change-password/:id',
  checkPermission('account-admin-change-password'),
  upload.none(),
  accountValidate.changePasswordAccount, 
  accountController.PATCHaccountChangePassword)


export default router;