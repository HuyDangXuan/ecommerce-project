import { Router } from "express";
import * as roleController from "../../controllers/admin/role.controller";
import multer from "multer";
import * as roleValidate from "../../validates/admin/role.validate";
import { checkPermission } from "../../middlewares/auth.middleware";

const router = Router();

const upload = multer();

router.get('/role-list', checkPermission('role-list'), roleController.GETroleList)

router.get('/role-create', checkPermission('role-create'), roleController.GETroleCreate)
router.post('/role-create', checkPermission('role-create'), upload.none(), roleValidate.createRole, roleController.POSTroleCreate)

router.get('/role-edit/:id', checkPermission('role-edit'), roleController.GETroleEdit)
router.patch('/role-edit/:id', checkPermission('role-edit'), upload.none(), roleValidate.createRole, roleController.PATCHroleEdit)

router.patch('/role-delete/:id', checkPermission('role-delete'), roleController.PATCHroleDelete)

export default router;