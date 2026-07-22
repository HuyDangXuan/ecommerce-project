import { Router } from "express";
import * as postController from "../../controllers/admin/post.controller";
import multer from "multer";
import * as postValidate from "../../validates/admin/post.validate";
import { checkPermission } from "../../middlewares/auth.middleware";

const router = Router();

const upload = multer();

router.get('/post-list', checkPermission('post-list'), postController.GETpostList)
router.get('/post-create', checkPermission('post-create'), postController.GETcreatePost)
router.post('/post-create',  checkPermission('post-create'), upload.none(), postValidate.createPost, postController.POSTcreatePost)

router.get('/post-edit/:id', checkPermission('post-edit'), postController.GETeditPost)
router.patch('/post-edit/:id', checkPermission('post-edit'), upload.none(), postValidate.editPost, postController.PATCHeditPost)
router.patch('/post-delete/:id', checkPermission('post-delete'), postController.PATCHdeletePost)


router.get('/category-list', checkPermission('post-category'), postController.GETcategoryList)
router.get('/category-create', checkPermission('post-category-create'), postController.GETcreateCategory)
router.post('/category-create', checkPermission('post-category-create'), upload.none(), postValidate.createCategory, postController.POSTcreateCategory)

router.get('/category-edit/:id', checkPermission('post-category-edit'), postController.GETeditCategory)
router.patch('/category-edit/:id', checkPermission('post-category-edit'), upload.none(), postValidate.createCategory, postController.PATCHeditCategory)
router.patch('/category-delete/:id', checkPermission('post-category-delete'), postController.PATCHdeleteCategory)


export default router;