import { Router } from "express";
import * as roleController from "../../controllers/admin/role.controller";
import multer from "multer";
import * as roleValidate from "../../validates/admin/role.validate";

const router = Router();

const upload = multer();

router.get('/role-list', roleController.GETroleList)



router.get('/role-create', roleController.GETroleCreate)
router.post('/role-create', upload.none(), roleValidate.createRole, roleController.POSTroleCreate)

export default router;